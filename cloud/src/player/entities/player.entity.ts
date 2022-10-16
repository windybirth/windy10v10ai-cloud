import { Collection } from 'fireorm';

@Collection()
export class Player {
  id: string;
  matchCount: number;
  winCount: number;
  seasonPointUsable: number;
  seasonPointTotal: number;
  chargePointUsable: number;
  chargePointTotal: number;
}
