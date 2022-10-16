import { Controller, Get } from '@nestjs/common';

import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  findAll() {
    return this.matchService.findAll();
  }
}
