import {
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
import { MemberDto } from '../members/dto/member.dto';
import { MembersService } from '../members/members.service';
import { PlayerService } from '../player/player.service';
import { PlayerCountService } from '../player-count/player-count.service';
import { UpdatePlayerPropertyDto } from '../player-property/dto/update-player-property.dto';
import { PlayerPropertyService } from '../player-property/player-property.service';

import { GameEnd } from './dto/game-end.request.body';
import { GameStart } from './dto/game-start.response';
import { PointInfoDto } from './dto/point-info.dto';
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
    logger.debug(`[Game Start] with steamIds ${JSON.stringify(steamIds)}`);
    steamIds = this.gameService.validateSteamIds(steamIds);

    const pointInfo: PointInfoDto[] = [];

    // 创建新玩家，更新最后游戏时间
    const eventRewardSteamIds = [];
    for (const steamId of steamIds) {
      const eventRewardSteamId =
        await this.gameService.upsertPlayerInfo(steamId);
      eventRewardSteamIds.push(eventRewardSteamId);
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
    await this.matchService.countGameStart();
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
    const players =
      await this.playerService.findBySteamIdsWithLevelInfo(steamIdsStr);
    // 获取玩家属性
    // 测试服为纯净版 不获取玩家属性
    if (!this.gameService.isTestServer(apiKey)) {
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
    }

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
    this.gameService.validateApiKey(apiKey, 'Add Player Property');

    return this.playerPropertyService.update(updatePlayerPropertyDto);
  }
}
