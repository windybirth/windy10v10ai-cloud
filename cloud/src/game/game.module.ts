import { Module } from '@nestjs/common';

import { MatchModule } from '../match/match.module';
import { MembersModule } from '../members/members.module';
import { PlayerCountModule } from '../player-count/player-count.module';
import { PlayerModule } from '../player/player.module';

import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [MembersModule, PlayerCountModule, MatchModule, PlayerModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
