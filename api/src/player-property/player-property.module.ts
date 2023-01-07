import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { PlayerModule } from '../player/player.module';

import { PlayerProperty } from './entities/player-property.entity';
import { PlayerPropertyController } from './player-property.controller';
import { PlayerPropertyService } from './player-property.service';

@Module({
  imports: [PlayerModule, FireormModule.forFeature([PlayerProperty])],
  controllers: [PlayerPropertyController],
  providers: [PlayerPropertyService],
  exports: [PlayerPropertyService],
})
export class PlayerPropertyModule {}
