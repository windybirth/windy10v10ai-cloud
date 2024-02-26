import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello, this is the root of API! Env: ${process.env.NODE_ENV}, ENVIRONMENT: ${process.env.ENVIRONMENT}, TEST_ENV: ${process.env.TEST_ENV}, TEST_ENV2: ${process.env.TEST_ENV2}`;
  }
}
