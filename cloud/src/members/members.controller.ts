import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@Controller('/api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Post('/all')
  createAll(@Query('token') token: string) {
    if (token !== 'initAllMemberInfo') {
      throw new UnauthorizedException();
    }

    return this.membersService.createAll();
  }

  // @Get()
  @Get('/all')
  findAll(
    @Query('steamId', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamId: number[],
  ) {
    return this.membersService.findByIds(steamId);
  }

  // @Get(':ids')
  // findOne(@Param('ids') ids: number) {
  //   console.log('Get:id' + ids);
  //   return `Get:id ${ids}`;
  //   // return this.membersService.findOne(+id);
  // }

  @Get()
  findByIds(
    @Query('steamId', new ParseArrayPipe({ items: Number, separator: ',' }))
    steamId: number[],
  ) {
    return this.membersService.findByIds(steamId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.membersService.remove(+id);
  // }
}
