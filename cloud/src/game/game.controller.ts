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

import { GameInfo } from './dto/game-end.request.body';
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

  @Get('start')
  async start(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
    @Headers('x-api-key')
    apiKey: string,
    @Headers('x-country-code') countryCode: string,
  ) {
    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      throw new BadRequestException();
    }
    // 获取会员信息
    const res = await this.membersService.findBySteamIds(steamIds);
    try {
      await this.playerCountService.update({
        apikey: apiKey,
        countryCode: countryCode,
        playerIds: steamIds,
        memberIds: res.map((m) => m.steamId),
      });
    } catch (error) {
      console.error(error);
    }
    // 验证服务器主机
    if (apiKey === process.env.SERVER_APIKEY) {
      await this.matchService.gameStart();
    }
    return res;
  }

  @ApiBody({ type: GameInfo })
  @Post('end')
  end(
    @Headers('x-api-key') apiKey: string,
    @Body() gameInfo: GameInfo,
  ): string {
    // 验证服务器主机
    if (apiKey !== process.env.SERVER_APIKEY) {
      console.warn(`[Endgame] apiKey permission error with ${apiKey}.`);
      return 'Error';
    }
    if (gameInfo.winnerTeamId == 2) {
      this.matchService.gameEnd(true);
    } else {
      this.matchService.gameEnd(false);
    }
    const players = gameInfo.players;
    for (const player of players) {
      if (player.steamId > 0) {
        this.playerService.gameEnd(
          player.steamId,
          player.teamId == gameInfo.winnerTeamId,
          player.points,
        );
      }
    }
    return this.gameService.getOK();
  }
}
