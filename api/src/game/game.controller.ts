import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { logger } from 'firebase-functions';

import { CountService } from '../count/count.service';
import { MembersService } from '../members/members.service';
import { PlayerCountService } from '../player-count/player-count.service';
import { UpdatePlayerPropertyDto } from '../player-property/dto/update-player-property.dto';
import { PlayerPropertyService } from '../player-property/player-property.service';
import { PlayerService } from '../player/player.service';

import { GameEnd } from './dto/game-end.request.body';
import { GameStart } from './dto/game-start.response';
import { GameService } from './game.service';

@ApiTags('Game(Open)')
@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly membersService: MembersService,
    private readonly playerCountService: PlayerCountService,
    private readonly matchService: CountService,
    private readonly playerService: PlayerService,
    private readonly playerPropertyService: PlayerPropertyService,
  ) {}

  @Get(['start'])
  async start(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
    @Headers('x-api-key')
    apiKey: string,
    @Headers('x-country-code') countryCode: string,
  ): Promise<GameStart> {
    this.gameService.assertApiKey(apiKey);

    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      logger.warn(
        `[Game Start] steamIds has length more than 10, ${steamIds}.`,
      );
      throw new BadRequestException();
    }

    // 获取会员信息
    const members = await this.membersService.findBySteamIds(steamIds);
    try {
      await this.playerCountService.update({
        countryCode: countryCode,
        playerIds: steamIds,
        memberIds: members.map((m) => m.steamId),
      });
    } catch (error) {
      logger.warn(`[Game Start] playerCount Failed, ${steamIds}`, error);
    }

    // 记录游戏开始信息，创建玩家数据
    await this.matchService.countGameStart();
    for (const steamId of steamIds) {
      const isMember = members.some((m) => m.steamId === steamId);
      await this.playerService.upsertGameStart(steamId, isMember);
    }

    // 获取玩家信息
    const steamIdsStr = steamIds.map((id) => id.toString());
    const players = await this.playerService.findBySteamIdsWithLevelInfo(
      steamIdsStr,
    );
    // 添加玩家属性信息
    for (const player of players) {
      const property = await this.playerPropertyService.findBySteamId(
        +player.id,
      );
      if (property) {
        player.properties = property;
      } else {
        player.properties = [];
      }
    }

    // 赛季前100名
    const top100SteamIds =
      await this.playerService.findTop100SeasonPointSteamIds();
    return { members, players, top100SteamIds };
  }

  @ApiBody({ type: GameEnd })
  @Post('end')
  async end(
    @Headers('x-api-key') apiKey: string,
    @Body() gameInfo: GameEnd,
  ): Promise<string> {
    this.gameService.assertApiKey(apiKey);

    const players = gameInfo.players;
    for (const player of players) {
      if (player.steamId > 0) {
        await this.playerService.upsertGameEnd(
          player.steamId,
          player.teamId == gameInfo.winnerTeamId,
          player.points,
          player.isDisconnect,
        );
      }
    }

    await this.matchService.countGameEnd(gameInfo);
    await this.matchService.countGameDifficult(gameInfo);
    await this.matchService.countHeroes(gameInfo);

    return this.gameService.getOK();
  }

  @Put('addPlayerProperty')
  addPlayerProperty(
    @Headers('x-api-key') apiKey: string,
    @Body() updatePlayerPropertyDto: UpdatePlayerPropertyDto,
  ) {
    this.gameService.assertApiKey(apiKey);

    return this.playerPropertyService.update(updatePlayerPropertyDto);
  }
}
