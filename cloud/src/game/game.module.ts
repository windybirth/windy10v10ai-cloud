import { Module } from '@nestjs/common';

import { MembersModule } from '../members/members.module';
import { PlayerCountModule } from '../player-count/player-count.module';

import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [MembersModule, PlayerCountModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
