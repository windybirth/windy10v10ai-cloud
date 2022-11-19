import { Controller, Get } from '@nestjs/common';

import { MembersService } from '../members/members.service';
import { PlayerPropertyService } from '../player-property/player-property.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly playerPropertyService: PlayerPropertyService,
    private readonly membersService: MembersService,
  ) {}

  @Get('/init')
  initTestData() {
    this.playerPropertyService.initialLevel();
    this.playerPropertyService.initialProperty();
    this.membersService.createMember({
      steamId: 136407523,
      month: 1,
    });
  }
}
