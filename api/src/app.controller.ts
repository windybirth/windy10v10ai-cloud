/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as functions from 'firebase-functions';

import { AppService } from './app.service';

@ApiTags('Hello World')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  getEnv(): string {
    // 打印所有环境变量
    const test_env = functions.config().admin?.test_env;
    return `test_env: ${test_env}`;
  }

  // get secrets from firebase
  @Get('secrets')
  getSecrets(): string {
    return this.appService.getSecrets();
  }
}
