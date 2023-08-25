import { Injectable, UnauthorizedException } from '@nestjs/common';
import { logger } from 'firebase-functions';

import { Player } from '../player/entities/player.entity';
import { PlayerService } from '../player/player.service';

@Injectable()
export class GameService {
  constructor(private readonly playerService: PlayerService) {}

  getOK(): string {
    return 'OK';
  }

  assertApiKey(apiKey: string) {
    if (
      apiKey !== process.env.SERVER_APIKEY &&
      apiKey !== process.env.SERVER_APIKEY_TEST
    ) {
      logger.warn(`[Game Start] apiKey permission error with ${apiKey}.`);
      throw new UnauthorizedException();
    }
  }

  // 创建并更新会员情报
  async upsertMemberInfo(steamId: number, isMember: boolean) {
    // 创建新玩家
    let player = await this.playerService.createNewPlayer(steamId);

    // 判断赋予多少活动积分
    const rSteamId = await this.giveEventPoints(
      new Date(process.env.EVENT_START_TIME),
      new Date(process.env.EVENT_END_TIME),
      +process.env.EVENT_SEASON_POINT,
      player,
    );

    // 判断赋予多少会员积分
    player = await this.playerService.upsertMemberPoint(player, isMember);

    // 更新最后游戏时间
    await this.playerService.updateLastMatchTime(player);

    return rSteamId;
  }

  // 活动积分赋予
  // 参数 活动期间（开始，结束），发放赛季积分数量
  async giveEventPoints(
    startTime: Date,
    endTime: Date,
    seasonPoints: number,
    player: Player,
  ): Promise<number> {
    // TODO env读取失败时 return

    // if now is not in the event time, return
    const now = new Date();
    if (now < startTime || now > endTime) {
      return null;
    }

    // 检测用户是否为活动期间首次登陆 player.lastMatchTime
    if (player.lastMatchTime < startTime) {
      // 发放积分（赛季 player.seasonPointTotal
      player.seasonPointTotal = seasonPoints;
      // update player
      // 把 id 改为 steamId
      const steamId = +player.id;
      await this.playerService.upsertAddPoint(steamId, player);
      return steamId;
    }
    // }
    return null;
  }
}
