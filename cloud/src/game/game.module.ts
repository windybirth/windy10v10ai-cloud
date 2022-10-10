import { Module } from '@nestjs/common';

import { MembersModule } from '../members/members.module';

import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [MembersModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
