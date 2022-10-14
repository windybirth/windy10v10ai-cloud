import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { GamePlayerCount } from './entities/game-player-count.entity';
import { PlayerCountController } from './player-count.controller';
import { PlayerCountService } from './player-count.service';

@Module({
  imports: [FireormModule.forFeature([GamePlayerCount])],
  controllers: [PlayerCountController],
  providers: [PlayerCountService],
})
export class PlayerCountModule {}
