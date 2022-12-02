import { Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlayerCountService } from './player-count.service';

@ApiTags('Player Count')
@Controller('player-count')
export class PlayerCountController {
  constructor(private readonly playerCountService: PlayerCountService) {}

  @Get()
  findAll() {
    return this.playerCountService.findAll();
  }
}
