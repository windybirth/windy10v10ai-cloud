import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { CreateMemberDto } from './dto/create-member.dto';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // 开通会员 指定月份
  @ApiBody({ type: CreateMemberDto })
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.createMember(createMemberDto);
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
