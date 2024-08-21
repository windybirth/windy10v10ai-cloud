import { Injectable } from '@nestjs/common';
import { logger } from 'firebase-functions';

@Injectable()
export class AnalyticsService {
  private measurementProtocolUrl =
    'https://www.google-analytics.com/mp/collect';
  private measurementId = process.env.GA_MEASUREMENT_ID;
  private apiSecret = process.env.GA_API_SECRET;

  constructor() {}
  login(steamId: number) {
    this.sendEvent('CLIENT_ID', steamId.toString(), 'login', {
      method: 'steam',
    });
  }

  async sendEvent(
    clientId: string,
    userId: string,
    eventName: string,
    eventParams: any,
  ) {
    const payload = {
      client_id: clientId, // 必须包含 client_id 或者 user_id
      user_id: userId,
      events: [
        {
          name: eventName,
          params: eventParams,
        },
      ],
    };

    try {
      const response = await fetch(
        `${this.measurementProtocolUrl}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.body;
    } catch (error) {
      logger.error('Error sending event to GA4:', error);
      throw error;
    }
  }
}
