export class HeroWinrate {
  heroName: string;
  win: number;
  total: number;
  winrate: number;
  pickrate: number;

  constructor(heroName: string) {
    this.heroName = heroName;
    this.win = 0;
    this.total = 0;
    this.winrate = 0;
    this.pickrate = 0;
  }
}
