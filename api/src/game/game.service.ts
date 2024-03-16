import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { logger } from 'firebase-functions';

import { EventRewardsService } from '../event-rewards/event-rewards.service';
import { Member } from '../members/entities/members.entity';
import { MembersService } from '../members/members.service';
import { Player } from '../player/entities/player.entity';
import { PlayerService } from '../player/player.service';
import { PlayerRank } from '../player-count/entities/player-rank.entity';
import { PlayerCountService } from '../player-count/player-count.service';
import { PlayerPropertyService } from '../player-property/player-property.service';

import { GameResetPlayerProperty } from './dto/game-reset-player-property';
import { PointInfoDto } from './dto/point-info.dto';

@Injectable()
export class GameService {
  private readonly resetPlayerPropertyMemberPoint = 1000;
  constructor(
    private readonly playerService: PlayerService,
    private readonly membersService: MembersService,
    private readonly playerCountService: PlayerCountService,
    private readonly eventRewardsService: EventRewardsService,
    private readonly playerPropertyService: PlayerPropertyService,
  ) {}

  getOK(): string {
    return 'OK';
  }

  validateApiKey(apiKey: string, apiName: string): void {
    if (this.isProductionServer(apiKey) || this.isTestServer(apiKey)) {
      return;
    }

    logger.warn(`[${apiName}] apiKey permission error with ${apiKey}.`);
    throw new UnauthorizedException();
  }

  isProductionServer(apiKey: string): boolean {
    return apiKey === process.env.SERVER_APIKEY;
  }

  isTestServer(apiKey: string): boolean {
    return apiKey === process.env.SERVER_APIKEY_TEST;
  }

  validateSteamIds(steamIds: number[]): number[] {
    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      logger.warn(
        `[Game Start] steamIds has length more than 10, ${steamIds}.`,
      );
      throw new BadRequestException();
    }
    return steamIds;
  }

  async addDailyMemberPoints(members: Member[]): Promise<PointInfoDto[]> {
    const memberDailyPoint = +process.env.MEMBER_DAILY_POINT;
    if (isNaN(memberDailyPoint)) {
      logger.error(`[Game Start] MEMBER_DAILY_POINT is NaN.`);
      return [];
    }

    const pointInfoDtos: PointInfoDto[] = [];
    for (const member of members) {
      const daliyMemberPoint = this.membersService.getDailyMemberPoint(member);
      // 判断是否为会员
      if (daliyMemberPoint > 0) {
        await this.playerService.upsertAddPoint(member.steamId, {
          memberPointTotal: memberDailyPoint,
        });
        await this.membersService.updateMemberLastDailyDate(member);
        // 返回会员积分信息
        pointInfoDtos.push({
          steamId: member.steamId,
          title: {
            cn: '获得会员积分',
            en: 'Get Member Daily Points',
          },
          memberPoint: memberDailyPoint,
        });
      }
    }

    return pointInfoDtos;
  }

  async upsertPlayerInfo(steamId: number): Promise<void> {
    const player = await this.playerService.findSteamIdAndNewPlayer(steamId);

    // 判断赋予多少活动积分
    // const seasonPointTobeAdd = this.giveEventPoints(
    //   new Date(process.env.EVENT_START_TIME),
    //   new Date(process.env.EVENT_END_TIME),
    //   +process.env.EVENT_SEASON_POINT,
    //   player,
    // );
    // 更新Player
    await this.playerService.updatePlayerLastMatchTime(
      player,
      // seasonPointTobeAdd,
      0,
      0,
    );

    // if (seasonPointTobeAdd > 0) {
    //   return steamId;
    // }
  }

  // 活动积分赋予
  // 参数 活动期间（开始，结束），发放赛季积分数量
  giveEventPoints(
    startTime: Date,
    endTime: Date,
    seasonPoints: number,
    player: Player,
  ) {
    if (isNaN(seasonPoints)) {
      return 0;
    }
    // if now is not in the event time, return
    const now = new Date();
    if (now < startTime || now > endTime) {
      return 0;
    }

    // 检测用户是否为活动期间首次登陆 player.lastMatchTime
    if (player.lastMatchTime < startTime) {
      // 发放积分（赛季 player.seasonPointTotal
      player.seasonPointTotal = seasonPoints;
    }
    return player.seasonPointTotal;
  }

  async getPlayerRank(): Promise<PlayerRank> {
    const playerRank = await this.playerCountService.getPlayerRankToday();

    if (playerRank) {
      return playerRank;
    } else {
      const rankSteamIds =
        await this.playerService.findTop100SeasonPointSteamIds();
      return await this.playerCountService.updatePlayerRankToday(rankSteamIds);
    }
  }

  // 活动赠送赛季积分
  async giveThridAnniversaryEventReward(
    steamIds: number[],
  ): Promise<PointInfoDto[]> {
    const pointInfoDtos: PointInfoDto[] = [];
    const startTime = new Date('2024-01-06T00:00:00.000Z');
    const endTime = new Date('2024-01-31T00:00:00.000Z');
    const rewordSeasonPoint = 2000;

    const now = new Date();
    if (now < startTime || now > endTime) {
      return pointInfoDtos;
    }

    // FIXME 每次需要更新
    const rewardResults =
      await this.eventRewardsService.getRewardResults(steamIds);
    for (const rewardResult of rewardResults) {
      if (rewardResult.result === false) {
        // 奖励一个月会员
        // await this.membersService.addMember({
        //   steamId: rewardResult.steamId,
        //   month: 1,
        // });
        // 奖励赛季积分
        await this.playerService.upsertAddPoint(rewardResult.steamId, {
          seasonPointTotal: rewordSeasonPoint,
        });
        // FIXME 每次需要更新
        await this.eventRewardsService.setReward(rewardResult.steamId);
        pointInfoDtos.push({
          steamId: rewardResult.steamId,
          title: {
            cn: '庆祝50000订阅! 送2000积分。<br>评分上5星再送3000赛季积分',
            en: 'Celebrating 50,000 subscriptions!<br>If rating get 5 stars, give more 3,000 points.',
          },
          seasonPoint: rewordSeasonPoint,
        });
      }
    }
    return pointInfoDtos;
  }

  async resetPlayerProperty(
    gameResetPlayerProperty: GameResetPlayerProperty,
  ): Promise<void> {
    const { steamId, useMemberPoint } = gameResetPlayerProperty;

    const player = (
      await this.playerService.findBySteamIdsWithLevelInfo([steamId.toString()])
    )[0];

    if (!player) {
      throw new BadRequestException();
    }

    // 消耗积分
    if (useMemberPoint) {
      const resetPlayerPropertyMemberPoint =
        this.resetPlayerPropertyMemberPoint;
      if (player.memberPointTotal < resetPlayerPropertyMemberPoint) {
        throw new BadRequestException();
      }
      await this.playerService.upsertAddPoint(steamId, {
        memberPointTotal: -resetPlayerPropertyMemberPoint,
      });
    } else {
      const resetPlayerPropertySeasonPoint = player.seasonNextLevelPoint;
      if (player.seasonPointTotal < resetPlayerPropertySeasonPoint) {
        throw new BadRequestException();
      }
      await this.playerService.upsertAddPoint(steamId, {
        seasonPointTotal: -resetPlayerPropertySeasonPoint,
      });
    }

    // 重置玩家属性
    await this.playerPropertyService.deleteBySteamId(steamId);
  }
}
