import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AfdianService } from './afdian.service';
import { AfdianWebhookDto } from './dto/afdian-webhook.dto';

@ApiTags('Afdian(Open)')
@Controller('afdian')
export class AfdianController {
  constructor(private readonly afdianService: AfdianService) {}

  @Post('/webhook')
  async processAfdianWebhook(
    @Headers() headers,
    @Body() afdianWebhookDto: AfdianWebhookDto,
    @Query('token') token: string,
  ) {
    if (token !== process.env.AFDIAN_TOKEN) {
      throw new UnauthorizedException();
    }
    const order = afdianWebhookDto?.data?.order;
    if (!order) {
      throw new BadRequestException();
    }
    const result = await this.afdianService.processAfdianOrder(order);
    if (result.success) {
      return { ec: 200, em: 'ok' };
    } else {
      return { ec: 400, em: '未能正确获取Dota2 ID，请联系我手动处理。' };
    }
  }
}
