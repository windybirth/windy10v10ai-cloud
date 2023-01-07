import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';

import { CountController } from './count.controller';
import { CountService } from './count.service';
import { CountDifficult } from './entities/count-difficult.entity';
import { CountHero } from './entities/count-hero.entity';
import { CountMatch } from './entities/count-match.entity';

@Module({
  imports: [FireormModule.forFeature([CountMatch, CountDifficult, CountHero])],
  controllers: [CountController],
  providers: [CountService],
  exports: [CountService],
})
export class CountModule {}
