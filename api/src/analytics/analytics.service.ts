import { Injectable } from '@nestjs/common';

import { GetSecretValue, SECRET } from '../util/secrets';

interface EventParams {
  [key: string]: number | string | boolean;
  session_id?: number;
  engagement_time_msec?: number;
}

@Injectable()
export class AnalyticsService {
  private readonly measurementProtocolUrl =
    'https://www.google-analytics.com/mp/collect';
  private measurementId = process.env.GA_MEASUREMENT_ID;
  private clientId = process.env.GA_CLIENT_ID;

  constructor() {}
  async login(steamId: number, matchId: number) {
    await this.sendEvent(steamId.toString(), 'login', {
      method: 'steam',
      session_id: matchId,
      engagement_time_msec: 1200,
    });
  }

  async sendEvent(userId: string, eventName: string, eventParams: EventParams) {
    const apiSecret = GetSecretValue(SECRET.GA4_API_SECRET);
    if (process.env.ENVIRONMENT === 'local') {
      eventParams['debug_mode'] = true;
    }

    const payload = {
      client_id: this.clientId,
      user_id: userId,
      non_personalized_ads: false,
      events: [
        {
          name: eventName,
          params: eventParams,
        },
      ],
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
