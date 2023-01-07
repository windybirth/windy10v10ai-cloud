import { Collection } from 'fireorm';

@Collection()
export class CountMatch {
  id: string;
  start: number;
  end: number;
  winner: number;
  date: string;

  init(id: string) {
    this.id = id;
    this.start = 0;
    this.end = 0;
    this.winner = 0;
    this.date = id;
    return this;
  }
  addMatchStart() {
    this.start++;
  }
  addMatchEnd(isWinner: boolean) {
    this.end++;
    if (isWinner) {
      this.winner++;
    }
  }
}
