import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { GameEnd } from '../game/dto/game-end.request.body';

import { MatchCount } from './entities/match-count.entity';
import { MatchDifficult } from './entities/match-difficult.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchCount)
    private readonly matchRepository: BaseFirestoreRepository<MatchCount>,
    @InjectRepository(MatchDifficult)
    private readonly matchDifficultRepository: BaseFirestoreRepository<MatchDifficult>,
  ) {}

  findAll() {
    return this.matchRepository.find();
  }

  async countGameStart() {
    const id = this.getDateString();
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

  async countGameEnd(gameEnd: GameEnd) {
    const isWinner = gameEnd.winnerTeamId == 2;
    const id = this.getDateString();
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

  async countGameDifficult(gameEnd: GameEnd) {
    // TODO 改为根据版本号判断
    const id = `${this.getDateString()}#${gameEnd.gameOption.gameDifficulty}`;
    const existMatchDifficult = await this.matchDifficultRepository.findById(
      id,
    );
    if (existMatchDifficult) {
      existMatchDifficult.add(gameEnd);
      await this.matchDifficultRepository.update(existMatchDifficult);
    } else {
      const matchCount = new MatchDifficult();
      matchCount.init(id);
      matchCount.add(gameEnd);
      await this.matchDifficultRepository.create(matchCount);
    }
  }

  private getDateString() {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
}
