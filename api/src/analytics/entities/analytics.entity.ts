import { Collection } from 'fireorm';

@Collection()
export class Analytics {
  id: string; // playerId
  sessionNumber: number;
}
