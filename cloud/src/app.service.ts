import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello, this is the root of Function! Env: ${process.env.NODE_ENV}`;
  }
  getApiHello(): string {
    return `Hello, this is the root of Hosting API! Env: ${process.env.NODE_ENV}`;
  }
}
