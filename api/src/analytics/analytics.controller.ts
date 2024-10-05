import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // FIXME only for testing
  @Post('steamId/:id/login')
  async login(
    @Param('id', new ParseIntPipe())
    steamId: number,
  ) {
    return await this.analyticsService.login(steamId, 0);
  }
}
