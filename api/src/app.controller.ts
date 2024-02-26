import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('Hello World')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  getEnv(): string {
    // 打印所有环境变量
    const env = process.env;
    let result = '';
    for (const key in env) {
      result += `${key}: ${env[key]}\n`;
    }
    return result;
  }
}
