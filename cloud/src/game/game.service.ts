import { Injectable, UnauthorizedException } from '@nestjs/common';

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
      console.warn(`[Endgame] apiKey permission error with ${apiKey}.`);
      throw new UnauthorizedException();
    }
  }
}
