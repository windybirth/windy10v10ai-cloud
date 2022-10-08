import { Collection } from 'fireorm';

@Collection()
export class Members {
  id: string;
  steamId!: number;
  expireDate!: Date;
}
