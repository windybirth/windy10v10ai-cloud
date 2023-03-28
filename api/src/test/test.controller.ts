import { Controller, Get } from '@nestjs/common';

import { MembersService } from '../members/members.service';
import { PlayerPropertyService } from '../player-property/player-property.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly playerPropertyService: PlayerPropertyService,
    private readonly membersService: MembersService,
  ) { }

  @Get('/init')
  async initTestData() {
    await this.playerPropertyService.initialLevel();
    await this.playerPropertyService.initialProperty();
    await this.membersService.initTestData();
  }
}
