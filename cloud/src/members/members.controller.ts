import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';

import { AfdianWebhookDto, OrderDto } from './dto/afdian-webhook.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { MembersService } from './members.service';
import { OrdersService } from './orders.service';

@Controller('/api/members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly ordersService: OrdersService,
  ) {}

  // 开通会员
  @Post()
  create(
    @Body() createMemberDto: CreateMemberDto,
    @Query('token') token: string,
  ) {
    if (token !== process.env.ADMIN_TOKEN) {
      throw new UnauthorizedException();
    }
    return this.membersService.create(createMemberDto);
  }

  // 爱发电 Webhook
  @Post('/afdian')
  async createAfdian(
    @Headers() headers,
    @Body() afdianWebhookDto: AfdianWebhookDto,
  ) {
    console.log('爱发电 Webhook');
    console.log(afdianWebhookDto);
    const order = afdianWebhookDto?.data?.order;
    if (!order) {
      throw new BadRequestException();
    }
    await this.ordersService.processAfdianOrder(order);
    return { ec: 200, em: 'ok' };
  }

  // 初期化会员数据进入Firestore，仅供测试
  @Post('/all')
  createAll(@Query('token') token: string) {
    if (
      process.env.NODE_ENV == 'develop' &&
      token !== process.env.ADMIN_TOKEN
    ) {
      throw new UnauthorizedException();
    }

    return this.membersService.createAll();
  }

  // 获取全体玩家信息 realtimedb
  @Get('/all')
  findAll() {
    return this.membersService.findAll();
  }

  // 检索复数玩家会员信息 最大10件 移除steamIds=0的项目
  @Get()
  findBySteamIds(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
  ) {
    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      throw new BadRequestException();
    }
    return this.membersService.findBySteamIds(steamIds);
  }

  // 获取单一会员信息（firestore
  @Get(':id')
  find(
    @Param('id', new ParseIntPipe())
    steamId: number,
  ) {
    return this.membersService.find(steamId);
  }
}
