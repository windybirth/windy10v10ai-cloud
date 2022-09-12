import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getApiHello(): string {
    return '[{"steamId": 136407523,"enable": true,"expireDateString": "2099-12-31"}]';
  }
}
