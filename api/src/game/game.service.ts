import { Injectable, UnauthorizedException } from '@nestjs/common';
import { logger } from 'firebase-functions';

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

  // 活动积分赋予
  // 参数 活动期间（开始，结束），发放赛季积分数量
  async giveEventPoints(
    startTime: Date,
    endTime: Date,
    seasonPoints: number,
    steamIds: number[],
  ): Promise<number[]> {
    // if now is not in the event time, return
    const now = new Date();
    if (now < startTime || now > endTime) {
      return [];
    }

    // get player
    const players = await this.playerService.findByIds(
      steamIds.map((id) => id.toString()),
    );

    // TODO 首次游戏的新用户 取不到？
    for (const player of players) {
      // 检测用户是否为活动期间首次登陆 player.lastMatchTime
      if (player.lastMatchTime < startTime) {
        // 发放积分（赛季 player.seasonPointTotal
        player.seasonPointTotal += seasonPoints;
        // update player
        // 把 id 改为 steamId
        const steamId = +player.id;
        await this.playerService.upsertAddPoint(steamId, player);
        // TODO fix return
        // return [steamId];
      }
    }
  }
}
