import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // test with user login
  @Post('steamId/:id/login')
  async login(
    @Param('id', new ParseIntPipe())
    steamId: number,
  ) {
    return this.analyticsService.login(steamId);
  }
}
