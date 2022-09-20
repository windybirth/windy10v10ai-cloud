import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateMemberDto } from './dto/create-member.dto';
import { MembersService } from './members.service';

@Controller('/api/members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
  ) {}

  // 开通会员
  @Post()
  create(
    @Body() createMemberDto: CreateMemberDto,
    @Query('token') token: string,
  ) {
    if (token !== this.configService.get<string>('ADMIN_TOKEN')) {
      throw new UnauthorizedException();
    }
    return this.membersService.create(createMemberDto);
  }

  // 初期化会员数据进入Firestore，仅供测试
  @Post('/all')
  createAll(@Query('token') token: string) {
    if (token !== this.configService.get<string>('ADMIN_TOKEN')) {
      throw new UnauthorizedException();
    }

    return this.membersService.createAll();
  }

  // 数据迁移 RealtimeDB to Firestore
  @Post('/migration')
  migration(@Query('token') token: string) {
    if (token !== this.configService.get<string>('ADMIN_TOKEN')) {
      throw new UnauthorizedException();
    }

    return this.membersService.migration();
  }

  // @Get()
  @Get('/all/firebase')
  findAllFirebase() {
    return this.membersService.findAllFirebase();
  }

  // 获取全体玩家信息 realtimedb
  @Get('/all')
  findAll(
    @Query('steamId', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
  ) {
    // FIXME use validation like @ArrayMaxSize(10)
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
    return this.membersService.findOne(steamId);
  }

  @Get()
  findBySteamIds(
    @Query('steamId', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
  ) {
    // FIXME use validation like @ArrayMaxSize(10)
    if (steamIds.length > 10) {
      throw new BadRequestException();
    }
    return this.membersService.findBySteamIds(steamIds);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
  //   return this.membersService.update(+id, updateMemberDto);
  // }
}
