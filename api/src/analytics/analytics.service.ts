import { Injectable } from '@nestjs/common';

import { GameEndDto } from '../game/dto/game-end.request.body';
import { GetSecretValue, SECRET } from '../util/secrets';

interface Event {
  name: string;
  params: {
    [key: string]: number | string | boolean;
    session_id?: number;
    engagement_time_msec?: number;
  };
}

@Injectable()
export class AnalyticsService {
  private readonly measurementProtocolUrl =
    'https://www.google-analytics.com/mp/collect';
  private readonly measurementId = process.env.GA_MEASUREMENT_ID;

  constructor() {}

  async gameStart(steamIds: number[], matchId: number) {
    for (const steamId of steamIds) {
      const event = {
        name: 'game_start',
        params: {
          method: 'steam',
          session_id: matchId,
          match_id: matchId,
          debug_mode: process.env.ENVIRONMENT === 'local',
          engagement_time_msec: 1000,
        },
      };

      await this.sendEvent(steamId.toString(), event);
    }
  }

  async gameEnd(gameEnd: GameEndDto) {
    for (const player of gameEnd.players) {
      if (player.steamId === 0) {
        // 暂且不统计电脑数据
        continue;
      }
      const event = {
        name: 'game_end',
        params: {
          method: 'steam',
          // game info
          session_id: gameEnd.matchId,
          match_id: gameEnd.matchId,
          debug_mode: process.env.ENVIRONMENT === 'local',
          engagement_time_msec: gameEnd.gameTimeMsec,
          difficulty: gameEnd.gameOption.gameDifficulty,
          version: gameEnd.version,
          // player info
          is_winner: gameEnd.winnerTeamId === 2,
          team_id: player.teamId,
          hero_name: player.heroName,
          points: player.points,
          is_disconnect: player.isDisconnect,
          steamId: player.steamId,
        },
      };

      await this.sendEvent(player.steamId.toString(), event);
    }
  }

  private async sendEvent(userId: string, event: Event) {
    const apiSecret = GetSecretValue(SECRET.GA4_API_SECRET);

    const payload = {
      client_id: userId,
      user_id: userId,
      non_personalized_ads: false,
      events: [event],
    };

    const response = await fetch(
      `${this.measurementProtocolUrl}?measurement_id=${this.measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.status === 204;
  }
}
