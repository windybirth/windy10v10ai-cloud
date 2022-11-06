import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { MatchService } from '../match/match.service';
import { MembersService } from '../members/members.service';
import { PlayerCountService } from '../player-count/player-count.service';
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
    private readonly matchService: MatchService,
    private readonly playerService: PlayerService,
  ) {}

  @Get(['start'])
  async start(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
    @Headers('x-api-key')
    apiKey: string,
    @Headers('x-country-code') countryCode: string,
  ): Promise<GameStart> {
    if (
      apiKey !== process.env.SERVER_APIKEY &&
      apiKey !== process.env.SERVER_APIKEY_TEST
    ) {
      console.warn(`[Endstart] apiKey permission error with ${apiKey}.`);
      return { members: [], players: [] };
    }

    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      console.warn(`[Endstart] steamIds has length more than 10, ${steamIds}.`);
      throw new BadRequestException();
    }

    // 获取会员信息
    const members = await this.membersService.findBySteamIds(steamIds);
    try {
      await this.playerCountService.update({
        apikey: apiKey,
        countryCode: countryCode,
        playerIds: steamIds,
        memberIds: members.map((m) => m.steamId),
      });
    } catch (error) {
      console.error(error);
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
    return { members, players };
  }

  @ApiBody({ type: GameEnd })
  @Post('end')
  end(@Headers('x-api-key') apiKey: string, @Body() gameInfo: GameEnd): string {
    if (
      apiKey !== process.env.SERVER_APIKEY &&
      apiKey !== process.env.SERVER_APIKEY_TEST
    ) {
      console.warn(`[Endgame] apiKey permission error with ${apiKey}.`);
      return 'error';
    }
    if (gameInfo.winnerTeamId == 2) {
      this.matchService.countGameEnd(true);
    } else {
      this.matchService.countGameEnd(false);
    }
    const players = gameInfo.players;
    for (const player of players) {
      if (player.steamId > 0) {
        this.playerService.upsertGameEnd(
          player.steamId,
          player.teamId == gameInfo.winnerTeamId,
          player.points,
          player.isDisconnect,
        );
      }
    }
    return this.gameService.getOK();
  }
}
