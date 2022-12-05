import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { MatchCount } from './entities/match-count.entity';
import { MatchDifficult } from './entities/match-difficult.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [FireormModule.forFeature([MatchCount, MatchDifficult])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
