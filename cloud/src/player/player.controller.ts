import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlayerService } from './player.service';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get('/fix')
  fix() {
    return this.playerService.fixPlayers();
  }

  @Get('/counts')
  count() {
    return this.playerService.count();
  }
  @Get('/scoreall')
  scoreAll() {
    return this.playerService.scoreAll();
  }
}
