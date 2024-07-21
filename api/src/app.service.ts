import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello, this is the root of API! Env: ${process.env.NODE_ENV}, ENVIRONMENT: ${process.env.ENVIRONMENT}`;
  }

  //get secrets from firebase
  getSecrets(): string {
    return `discordApiKey: ${process.env.TEST_SECRET}`;
  }
}
