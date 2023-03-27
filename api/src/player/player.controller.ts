import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AddAllSeasonPointDto } from './dto/add-all-season-point.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ResetSeasonPoint } from './dto/reset-season-point.dto';
import { PlayerService } from './player.service';

@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/steamId/:steamId')
  findOne(@Param('steamId') steamId: string) {
    return this.playerService.findBySteamId(+steamId);
  }

  @Patch('/steamId/:steamId')
  update(@Param('steamId') steamId: number, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(
      steamId,
      updatePlayerDto,
    );
  }
  
  @Get('/all/csv')
  scoreAll() {
    return this.playerService.scoreAll();
  }

  @Post('/all/resetSeasonPoint')
  resetSeasonPoint(@Body() resetSeasonPoint: ResetSeasonPoint) {
    // TODO reset season point
    // TODO record 1st season level
  }

  @Post('/all/addSeasonPoint')
  addAllSeasonPoint(@Body() addAllSeasonPoint: AddAllSeasonPointDto) {
    return this.playerService.addAllSeasonPoint(
      addAllSeasonPoint.point,
      addAllSeasonPoint.startFrom,
    );
  }
}
