import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  private measurementProtocolUrl =
    'https://www.google-analytics.com/mp/collect';

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
        `${this.measurementProtocolUrl}?measurement_id=G-XXXXXXXXXX&api_secret=YOUR_API_SECRET`,
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
      console.error('Error sending event to GA4:', error);
      throw error;
    }
  }
}
