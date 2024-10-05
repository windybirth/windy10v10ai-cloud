import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';

import { GameEnd } from '../game/dto/game-end.request.body';

import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: BaseFirestoreRepository<Match>,
  ) {}

  /**
   * 游戏结束后记录比赛信息
   */
  async recordMatch(gameInfo: GameEnd) {
    const match = new Match();
    match.id = gameInfo.matchId.toString();
    match.version = gameInfo.version;
    match.difficulty = gameInfo.gameOption.gameDifficulty;
    match.winnerTeamId = gameInfo.winnerTeamId;
    match.gameOption = gameInfo.gameOption;
    match.players = gameInfo.players;
    return this.matchRepository.create(match);
  }
}
