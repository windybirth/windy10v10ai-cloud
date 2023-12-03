import { Collection } from 'fireorm';

@Collection()
export class EventReward {
  id!: string;
  steamId!: number;
  thridAnniversary?: boolean;
}
