import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { logger } from 'firebase-functions';

import { Member } from '../members/entities/members.entity';
import { MembersService } from '../members/members.service';
import { PlayerRank } from '../player-count/entities/player-rank.entity';
import { PlayerCountService } from '../player-count/player-count.service';
import { Player } from '../player/entities/player.entity';
import { PlayerService } from '../player/player.service';

import { PointInfoDto } from './dto/point-info.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly membersService: MembersService,
    private readonly playerCountService: PlayerCountService,
  ) {}

  getOK(): string {
    return 'OK';
  }

  assertApiKey(apiKey: string, allowTest = true): void {
    const keys = [process.env.SERVER_APIKEY];

    if (allowTest) {
      keys.push(process.env.SERVER_APIKEY_TEST);
    }

    if (keys.indexOf(apiKey) === -1) {
      logger.warn(`[Game Start] apiKey permission error with ${apiKey}.`);
      throw new UnauthorizedException();
    }
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
            cn: '会员每日登录积分',
            en: 'Member Daily Login Points',
          },
          memberPoint: memberDailyPoint,
        });
      }
    }

    return pointInfoDtos;
  }

  async upsertPlayerInfo(steamId: number): Promise<number> {
    const player = await this.playerService.findSteamIdAndNewPlayer(steamId);

    // 判断赋予多少活动积分
    const seasonPointTobeAdd = this.giveEventPoints(
      new Date(process.env.EVENT_START_TIME),
      new Date(process.env.EVENT_END_TIME),
      +process.env.EVENT_SEASON_POINT,
      player,
    );
    // 更新Player
    await this.playerService.updatePlayerLastMatchTime(
      player,
      seasonPointTobeAdd,
      0,
    );

    if (seasonPointTobeAdd > 0) {
      return steamId;
    }
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
}
