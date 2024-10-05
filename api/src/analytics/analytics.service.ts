import { Injectable } from '@nestjs/common';

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
  private measurementId = process.env.GA_MEASUREMENT_ID;
  private clientId = process.env.GA_CLIENT_ID;

  constructor() {}
  async login(steamId: number, matchId: number) {
    const event = {
      name: 'login',
      params: {
        method: 'steam',
        session_id: matchId,
        match_id: matchId,
        debug_mode: process.env.ENVIRONMENT === 'local',
      },
    };

    await this.sendEvent(steamId.toString(), event);
  }

  async sendEvent(userId: string, event: Event) {
    const apiSecret = GetSecretValue(SECRET.GA4_API_SECRET);

    const payload = {
      client_id: this.clientId,
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
