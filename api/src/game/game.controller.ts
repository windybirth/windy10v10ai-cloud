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
    // this.gameService.assertApiKey(apiKey);

    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      logger.warn(
        `[Game Start] steamIds has length more than 10, ${steamIds}.`,
      );
      throw new BadRequestException();
    }

    // 获取会员信息
    const members = await this.membersService.findBySteamIds(steamIds);
    // 统计会员游戏数据
    await this.playerCountService
      .update({
        countryCode: countryCode,
        playerIds: steamIds,
        memberIds: members.map((m) => m.steamId),
      })
      .catch((error) => {
        logger.warn(`[Game Start] playerCount Failed, ${steamIds}`, error);
      });

    // 统计每日开始游戏数据
    await this.matchService.countGameStart();

    // 创建新玩家，赋予各种积分，更新最后游戏时间
    const eventRewardSteamIds = [];
    for (const steamId of steamIds) {
      const isMember = members.some((m) => m.steamId === steamId);
      const eventRewardSteamId = await this.gameService.upsertPlayerInfo(
        steamId,
        isMember,
      );
      eventRewardSteamIds.push(eventRewardSteamId);
    }

    const pointInfo = [
      {
        steamId: 385130282,
        title: {
          cn: '赛季积分1000 会员积分0',
          en: 'Event Points',
        },
        seasonPoint: 1000,
        memberPoint: 0,
      },
      {
        steamId: 385130282,
        title: {
          cn: '赛季积分undefined 会员积分999',
          en: 'Event Points',
        },
        memberPoint: 999,
      },
    ];

    // 获取玩家信息
    const steamIdsStr = steamIds.map((id) => id.toString());
    const players = await this.playerService.findBySteamIdsWithLevelInfo(
      steamIdsStr,
    );
    // 获取玩家属性
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

    // 排行榜
    const playerRank = await this.gameService.getPlayerRank();
    const top100SteamIds = playerRank.rankSteamIds;
    return { members, players, top100SteamIds, pointInfo };
  }

  @ApiBody({ type: GameEnd })
  @Post('end')
  async end(
    @Headers('x-api-key') apiKey: string,
    @Body() gameInfo: GameEnd,
  ): Promise<string> {
    this.gameService.assertApiKey(apiKey, false);

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
    // this.gameService.assertApiKey(apiKey);

    return this.playerPropertyService.update(updatePlayerPropertyDto);
  }
}
