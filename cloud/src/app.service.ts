import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, this is the root of Function!';
  }
  getApiHello(): string {
    return 'Hello, this is the API root of Hosting!';
  }
}
