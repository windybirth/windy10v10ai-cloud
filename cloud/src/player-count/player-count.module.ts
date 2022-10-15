import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { PlayerCount } from './entities/player-count.entity';
import { PlayerCountController } from './player-count.controller';
import { PlayerCountService } from './player-count.service';

@Module({
  imports: [FireormModule.forFeature([PlayerCount])],
  controllers: [PlayerCountController],
  providers: [PlayerCountService],
  exports: [PlayerCountService],
})
export class PlayerCountModule {}
