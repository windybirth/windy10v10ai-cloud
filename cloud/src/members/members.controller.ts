import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateMemberDto } from './dto/create-member.dto';
import { GamesService } from './games.service';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly gamesService: GamesService,
  ) {}

  // 开通会员 指定月份
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.createMember(createMemberDto);
  }

  @Get('/all')
  async findAll() {
    return this.membersService.findAll();
  }

  // FIXME 迁移到games
  // 检索复数玩家会员信息 最大10件 移除steamIds=0的项目
  @Get()
  async findBySteamIds(
    @Query('steamIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamIds: number[],
  ) {
    steamIds = steamIds.filter((id) => id > 0);
    if (steamIds.length > 10) {
      throw new BadRequestException();
    }
    const res = await this.membersService.findBySteamIds(steamIds);
    return res;
  }

  @Get(':id')
  find(
    @Param('id', new ParseIntPipe())
    steamId: number,
  ) {
    return this.membersService.find(steamId);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseIntPipe())
    steamId: number,
  ) {
    return this.membersService.remove(steamId);
  }

  // 初期化会员数据进入Firestore，仅供测试
  @Post('/init')
  initTestData() {
    if (process.env.NODE_ENV !== 'develop' && process.env.NODE_ENV !== 'test') {
      throw new ForbiddenException();
    }
    return this.membersService.initTestData();
  }
}
