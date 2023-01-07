import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Collection } from 'fireorm';

@Collection()
export class Player {
  @ApiProperty()
  id: string;
  @ApiProperty()
  matchCount: number;
  @ApiProperty()
  winCount: number;
  @ApiProperty()
  disconnectCount: number;
  @ApiProperty()
  seasonPointTotal: number;
  @ApiProperty()
  memberPointTotal: number;
  // 行为分
  @ApiProperty()
  conductPoint: number;
  // 最近一次游戏开始时间
  @Exclude()
  lastMatchTime: Date;
}
