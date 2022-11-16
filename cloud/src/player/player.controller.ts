import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlayerService } from './player.service';

@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get('/counts')
  count() {
    return this.playerService.count();
  }
  @Get('/scoreall')
  scoreAll() {
    return this.playerService.scoreAll();
  }

  @Post('/setMemberLevel')
  setMemberLevel(
    @Query('steamId') steamId: number,
    @Query('level') level: number,
  ) {
    return this.playerService.setMemberLevel(+steamId, +level);
  }
}
