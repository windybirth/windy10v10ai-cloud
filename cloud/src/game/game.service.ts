import { Injectable, UnauthorizedException } from '@nestjs/common';
import { logger } from 'firebase-functions';

@Injectable()
export class GameService {
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
}
