import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as functions from 'firebase-functions';

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
    const test_env = functions.config().admin.test_env;
    const test_env2 = functions.config().api.test_env2;
    let result = '';
    result += `test_env: ${test_env}\n`;
    result += `test_env2: ${test_env2}\n`;
    return result;
  }
}
