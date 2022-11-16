import { Exclude } from 'class-transformer';
import { Collection } from 'fireorm';

@Collection()
export class PlayerProperty {
  @Exclude()
  id: string;
  steamId: number;
  name: string;
  level: number;
}
