import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  // @Post('/addAllSeasonPoint/:point')
  // addAllSeasonPoint(@Param('point') point: string) {
  //   return this.playerService.addAllSeasonPoint(+point);
  // }
}
