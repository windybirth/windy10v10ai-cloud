import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api')
  getApi(): string {
    return this.appService.getApiHello();
  }
  @Get('/api/members/all')
  getApiMemberAll(@Query() param): string {
    console.log(param);
    return this.appService.getApiHello();
  }
}
