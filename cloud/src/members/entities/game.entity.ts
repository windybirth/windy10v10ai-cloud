import { Collection } from 'fireorm';

@Collection()
export class Game {
  id: string;
  matchId: string;
  mapType: string;
  apiKey: string;
  countryCode: string;
  playerCount: number;
  memberPlayerCount: number;
  steamIds: number[];
  createdAt: Date;
}
