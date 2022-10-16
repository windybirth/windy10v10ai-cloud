import { Collection } from 'fireorm';

@Collection()
export class Player {
  id: string;
  matchCount: number;
  winCount: number;
  disconnectCount: number;
  seasonPointUsable: number;
  seasonPointTotal: number;
  chargePointUsable: number;
  chargePointTotal: number;
}
