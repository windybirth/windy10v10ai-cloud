import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { GameEnd } from '../game/dto/game-end.request.body';

import { CountDifficult } from './entities/count-difficult.entity';
import { CountHero, HeroType } from './entities/count-hero.entity';
import { CountMatch } from './entities/count-match.entity';

@Injectable()
export class CountService {
  constructor(
    @InjectRepository(CountMatch)
    private readonly matchRepository: BaseFirestoreRepository<CountMatch>,
    @InjectRepository(CountDifficult)
    private readonly matchDifficultRepository: BaseFirestoreRepository<CountDifficult>,
    @InjectRepository(CountHero)
    private readonly countHeroRepository: BaseFirestoreRepository<CountHero>,
  ) {}

  findAllMatch() {
    return this.matchRepository.find();
  }

  async countGameStart() {
    const id = this.getDateString();
    const existMatchCount = await this.matchRepository.findById(id);
    if (existMatchCount) {
      existMatchCount.addMatchStart();
      await this.matchRepository.update(existMatchCount);
    } else {
      const matchCount = new CountMatch();
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
      const matchCount = new CountMatch();
      matchCount.init(id);
      matchCount.addMatchEnd(isWinner);
      await this.matchRepository.create(matchCount);
    }
  }

  async countGameDifficult(gameEnd: GameEnd) {
    const id = `${gameEnd.version}#${gameEnd.gameOption.gameDifficulty}`;
    const existMatchDifficult = await this.matchDifficultRepository.findById(
      id,
    );
    if (existMatchDifficult) {
      existMatchDifficult.add(gameEnd);
      await this.matchDifficultRepository.update(existMatchDifficult);
    } else {
      const matchCount = new CountDifficult();
      matchCount.init(id);
      matchCount.add(gameEnd);
      await this.matchDifficultRepository.create(matchCount);
    }
  }

  async countHeroes(gameEnd: GameEnd) {
    for (const player of gameEnd.players) {
      let heroType: HeroType;
      if (player.steamId != 0) {
        // 人类玩家
        heroType = HeroType.human;
      } else if (player.teamId == 3) {
        // 夜魇bot
        heroType = HeroType.bot;
      } else {
        // 天辉bot
        continue;
      }
      const id = `${gameEnd.version}#${gameEnd.gameOption.gameDifficulty}#${heroType}#${player.heroName}`;
      const exist = await this.countHeroRepository.findById(id);

      const countHero = exist ?? new CountHero().init(id);
      countHero.add(player, gameEnd.winnerTeamId);
      if (exist) {
        await this.countHeroRepository.update(countHero);
      } else {
        await this.countHeroRepository.create(countHero);
      }
    }
  }

  private getDateString() {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
}
