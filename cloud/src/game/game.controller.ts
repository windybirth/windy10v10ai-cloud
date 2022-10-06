import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GameService } from './game.service';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('start')
  start(): string {
    return this.gameService.getHello();
  }

  @Post('end')
  end(@Headers('x-api-key') apiKey: string, @Body() body: any): string {
    console.log(apiKey);
    console.log(body);
    return this.gameService.getHello();
  }
}
