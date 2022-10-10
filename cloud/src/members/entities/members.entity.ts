import { Collection } from 'fireorm';

@Collection()
export class Member {
  id: string;
  steamId!: number;
  expireDate!: Date;
}
