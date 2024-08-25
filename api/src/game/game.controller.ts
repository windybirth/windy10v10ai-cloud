import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { logger } from 'firebase-functions';

import { CountService } from '../count/count.service';
import { MatchService } from '../match/match.service';
import { MemberDto } from '../members/dto/member.dto';
import { MembersService } from '../members/members.service';
import { PlayerService } from '../player/player.service';
import { PlayerCountService } from '../player-count/player-count.service';
import { UpdatePlayerPropertyDto } from '../player-property/dto/update-player-property.dto';
import { PlayerPropertyService } from '../player-property/player-property.service';

import { GameEnd } from './dto/game-end.request.body';
import { GameResetPlayerProperty } from './dto/game-reset-player-property';
import { GameStart } from './dto/game-start.response';
import { PlayerDto } from './dto/player.dto';
import { PointInfoDto } from './dto/point-info.dto';
import { GameService } from './game.service';

@ApiTags('Game(Open)')
@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly membersService: MembersService,
    private readonly playerCountService: PlayerCountService,
    private readonly countService: CountService,
    private readonly playerService: PlayerService,
    private readonly playerPropertyService: PlayerPropertyService,
    private readonly matchService: MatchService,
  ) {}

  @Get(['start'])
  async start(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
    @Headers('x-api-key')
    apiKey: string,
    @Headers('x-country-code') countryCode: string,
  ): Promise<GameStart> {
    logger.debug(`[Game Start] with steamIds ${JSON.stringify(steamIds)}`);
    steamIds = this.gameService.validateSteamIds(steamIds);

    const pointInfo: PointInfoDto[] = [];

    // 创建新玩家，更新最后游戏时间
    for (const steamId of steamIds) {
      await this.gameService.upsertPlayerInfo(steamId);
    }

    const eventRewardInfo =
      await this.gameService.giveThridAnniversaryEventReward(steamIds);
    pointInfo.push(...eventRewardInfo);

    // 获取会员 添加每日会员积分
    const members = await this.membersService.findBySteamIds(steamIds);
    // 添加每日会员积分
    const memberDailyPointInfo =
      await this.gameService.addDailyMemberPoints(members);
    pointInfo.push(...memberDailyPointInfo);

    // ----------------- 以下为统计数据 -----------------
    // 统计每日开始游戏数据
    await this.countService.countGameStart();
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

    // ----------------- 以下为返回数据 -----------------
    // 获取玩家信息
    const steamIdsStr = steamIds.map((id) => id.toString());
    const players = await this.gameService.findPlayerDtoBySteamIds(steamIdsStr);

    // 排行榜
    const playerRank = await this.gameService.getPlayerRank();
    const top100SteamIds = playerRank.rankSteamIds;

    return {
      members: members.map((m) => new MemberDto(m)),
      players,
      top100SteamIds,
      pointInfo,
    };
  }

  @ApiBody({ type: GameEnd })
  @Post('end')
  async end(
    @Headers('x-api-key') apiKey: string,
    @Body() gameInfo: GameEnd,
  ): Promise<string> {
    logger.debug(`[Game End] ${JSON.stringify(gameInfo)}`);
    this.gameService.validateApiKey(apiKey, 'Game End');

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

    await this.countService.countGameEnd(gameInfo);
    await this.countService.countGameDifficult(gameInfo);
    await this.countService.countHeroes(gameInfo);
    await this.matchService.recordMatch(gameInfo);

    return this.gameService.getOK();
  }

  @Put('addPlayerProperty')
  async addPlayerProperty(
    @Headers('x-api-key') apiKey: string,
    @Body() updatePlayerPropertyDto: UpdatePlayerPropertyDto,
  ): Promise<PlayerDto> {
    this.gameService.validateApiKey(apiKey, 'Add Player Property');

    await this.playerPropertyService.update(updatePlayerPropertyDto);

    return await this.gameService.findPlayerDtoBySteamId(
      updatePlayerPropertyDto.steamId,
    );
  }

  @Post('resetPlayerProperty')
  async resetPlayerProperty(
    @Headers('x-api-key') apiKey: string,
    @Body() gameResetPlayerProperty: GameResetPlayerProperty,
  ) {
    this.gameService.validateApiKey(apiKey, 'Reset Player Property');

    logger.debug(
      `[Reset Player Property] ${JSON.stringify(gameResetPlayerProperty)}`,
    );

    await this.gameService.resetPlayerProperty(gameResetPlayerProperty);

    return await this.gameService.findPlayerDtoBySteamId(
      gameResetPlayerProperty.steamId,
    );
  }

  @Get('player/steamId/:steamId')
  async getPlayerInfo(
    @Headers('x-api-key') apiKey: string,
    @Param('steamId') steamId: number,
  ): Promise<PlayerDto> {
    this.gameService.validateApiKey(apiKey, 'Get Player Info');

    logger.debug(`[Get Player Info] ${steamId}`);

    return await this.gameService.findPlayerDtoBySteamId(steamId);
  }
}
