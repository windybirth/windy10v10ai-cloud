import { Injectable, UnauthorizedException } from '@nestjs/common';
import { logger } from 'firebase-functions';

@Injectable()
export class GameService {
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
}
