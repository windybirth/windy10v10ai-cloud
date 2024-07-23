import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { logger } from 'firebase-functions/v1';

import { PatreonWebhookDto } from './dto/patreon-webhook.dto';
import { PatreonService } from './patreon.service';

@ApiTags('Patreon(Open)')
@Controller('patreon')
export class PatreonController {
  constructor(private readonly patreonService: PatreonService) {}

  @Post('/webhook')
  async patreonWebhook(@Body() patreonWebhookDto: PatreonWebhookDto) {
    // if (token !== process.env.AFDIAN_TOKEN) {
    //   logger.error('Patreon token error');
    //   throw new UnauthorizedException();
    // }
    console.log('Patreon webhook called with:', patreonWebhookDto);
    logger.info('Patreon webhook called with:', patreonWebhookDto);
  }
}
