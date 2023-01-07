import { Collection } from 'fireorm';

import { PlayerGameEnd } from '../../game/dto/game-end.request.body';

export enum HeroType {
  human = 'h',
  bot = 'b',
}

@Collection()
export class CountHero {
  // version#difficulty#[h|b]#heroName
  id: string;
  version: string;
  difficulty: number;
  heroName: string;
  isHuman: boolean;

  total: number;
  win: number;

  init(id: string) {
    this.id = id;
    this.total = 0;
    this.win = 0;
    this.version = id.split('#')[0];
    this.difficulty = parseInt(id.split('#')[1]);
    this.isHuman = id.split('#')[2] == HeroType.human;
    this.heroName = id.split('#')[3];
    return this;
  }

  add(player: PlayerGameEnd, winnerTeamId: number) {
    this.total++;
    if (player.teamId == winnerTeamId) {
      this.win++;
    }
  }
}
