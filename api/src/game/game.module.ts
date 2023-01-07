import { Module } from '@nestjs/common';

import { CountModule } from '../count/count.module';
import { MembersModule } from '../members/members.module';
import { PlayerCountModule } from '../player-count/player-count.module';
import { PlayerPropertyModule } from '../player-property/player-property.module';
import { PlayerModule } from '../player/player.module';

import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    MembersModule,
    PlayerCountModule,
    CountModule,
    PlayerModule,
    PlayerPropertyModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
