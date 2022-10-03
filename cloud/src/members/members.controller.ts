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

import { AfdianWebhookDto } from './dto/afdian-webhook.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { GamesService } from './games.service';
import { MembersService } from './members.service';
import { OrdersService } from './orders.service';

@Controller('/api/members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly ordersService: OrdersService,
    private readonly gamesService: GamesService,
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

  // FIXME 移动至 orders.controller.ts
  // 爱发电 Webhook
  @Post('/afdian')
  async createAfdian(
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
    const result = await this.ordersService.processAfdianOrder(order);
    if (result.success) {
      return { ec: 200, em: 'ok' };
    } else {
      return { ec: 400, em: '未能正确获取Dota2 ID，请联系我手动处理。' };
    }
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

  // 获取全体玩家信息
  @Get('/all')
  async findAll() {
    return this.membersService.findAll();
  }

  // 检索复数玩家会员信息 最大10件 移除steamIds=0的项目
  @Get()
  async findBySteamIds(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
    @Headers('x-api-key') apiKey: string,
    @Headers('x-country-code') countryCode: string,
    @Query('matchId') matchId: string,
  ) {
    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      throw new BadRequestException();
    }
    const res = await this.membersService.findBySteamIds(steamIds);
    // FIXME 移除game记录
    await this.gamesService.recordMembersGame(
      matchId,
      apiKey,
      countryCode,
      steamIds,
      res.length,
    );
    return res;
  }

  // 统计游戏数据
  @Get('/countgames')
  countgames() {
    return this.gamesService.countgames();
  }
  // 获取单一会员信息
  @Get(':id')
  find(
    @Param('id', new ParseIntPipe())
    steamId: number,
  ) {
    return this.membersService.find(steamId);
  }
}
