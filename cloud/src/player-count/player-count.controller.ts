import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlayerCountService } from './player-count.service';

@ApiTags('Player Count')
@Controller('player-count')
export class PlayerCountController {
  constructor(private readonly playerCountService: PlayerCountService) {}

  @Get()
  update() {
    return this.playerCountService.update({
      apikey: '123',
      countryCode: 'CN',
      playerIds: ['123', '456'],
    });
  }
}
