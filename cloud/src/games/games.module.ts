import { Module } from '@nestjs/common';

import { GameController } from './games.controller';
import { GameService } from './games.service';

@Module({
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
