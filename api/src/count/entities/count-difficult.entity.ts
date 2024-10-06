import { Collection } from 'fireorm';

import { GameEndDto } from '../../game/dto/game-end.request.body';

@Collection()
export class CountDifficult {
  // version#difficulty
  id: string;
  matchTotal: number;
  matchWin: number;
  playerTotal: number;
  playerWin: number;
  version: string;
  difficulty: number;

  init(id: string) {
    this.id = id;
    this.matchTotal = 0;
    this.matchWin = 0;
    this.playerTotal = 0;
    this.playerWin = 0;
    this.version = id.split('#')[0];
    this.difficulty = parseInt(id.split('#')[1]);
    return this;
  }

  add(gameEnd: GameEndDto) {
    this.matchTotal++;
    const playerCount = gameEnd.players.filter((p) => p.steamId != 0).length;
    this.playerTotal += playerCount;
    if (gameEnd.winnerTeamId == 2) {
      this.matchWin++;
      this.playerWin += playerCount;
    }
  }
}
