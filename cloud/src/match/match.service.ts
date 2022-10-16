import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { MatchCount } from './entities/match-count.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchCount)
    private readonly matchRepository: BaseFirestoreRepository<MatchCount>,
  ) {}

  findAll() {
    return this.matchRepository.find();
  }

  async gameStart() {
    const id = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const existMatchCount = await this.matchRepository.findById(id);
    if (existMatchCount) {
      existMatchCount.addMatchStart();
      await this.matchRepository.update(existMatchCount);
    } else {
      const matchCount = new MatchCount();
      matchCount.init(id);
      matchCount.addMatchStart();
      await this.matchRepository.create(matchCount);
    }
  }

  async gameEnd(isWinner: boolean) {
    const id = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const existMatchCount = await this.matchRepository.findById(id);
    if (existMatchCount) {
      existMatchCount.addMatchEnd(isWinner);
      await this.matchRepository.update(existMatchCount);
    } else {
      const matchCount = new MatchCount();
      matchCount.init(id);
      matchCount.addMatchEnd(isWinner);
      await this.matchRepository.create(matchCount);
    }
  }
}
