import { Collection } from 'fireorm';

import { GameEnd } from '../../game/dto/game-end.request.body';

@Collection()
export class MatchDifficult {
  // data#difficulty
  id: string;
  matchTotal: number;
  matchWin: number;
  playerTotal: number;
  playerWin: number;

  init(id: string) {
    this.id = id;
    this.matchTotal = 0;
    this.matchWin = 0;
    this.playerTotal = 0;
    this.playerWin = 0;
    return this;
  }

  add(gameEnd: GameEnd) {
    this.matchTotal++;
    const playerCount = gameEnd.players.filter((p) => p.steamId != 0).length;
    this.playerTotal += playerCount;
    if (gameEnd.winnerTeamId == 2) {
      this.matchWin++;
      this.playerWin += playerCount;
    }
  }
}
