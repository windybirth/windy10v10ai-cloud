import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { Match } from './entities/match.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [FireormModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
