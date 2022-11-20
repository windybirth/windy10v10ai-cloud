import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AddMemberPointDto } from './dto/add-member-point.dto';
import { PlayerService } from './player.service';

@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/steamId/:steamId')
  findBySteamId(@Param('steamId') steamId: string) {
    return this.playerService.findBySteamId(+steamId);
  }

  @Get('/counts')
  count() {
    return this.playerService.count();
  }
  @Get('/scoreall')
  scoreAll() {
    return this.playerService.scoreAll();
  }

  @Post('/addMemberPoint')
  addMemberPoint(@Body() addMemberPoint: AddMemberPointDto) {
    return this.playerService.addMemberPoint(
      addMemberPoint.steamId,
      addMemberPoint.point,
    );
  }
  @Post('/setMemberLevel')
  setMemberLevel(
    @Query('steamId') steamId: number,
    @Query('level') level: number,
  ) {
    return this.playerService.setMemberLevel(+steamId, +level);
  }
}
