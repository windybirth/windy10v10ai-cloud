import { Collection } from 'fireorm';

// TODO remove this
@Collection()
export class Game {
  id: string;
  matchId: string;
  apiKey: string;
  countryCode: string;
  playerCount: number;
  memberPlayerCount: number;
  steamIds: number[];
  createdAt: Date;
}
