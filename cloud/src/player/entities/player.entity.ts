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
  // FIXME remove
  @ApiProperty()
  seasonPointUsable: number;
  @ApiProperty()
  seasonPointTotal: number;
  // FIXME remove
  @ApiProperty()
  chargePointUsable: number;
  // FIXME remove
  @ApiProperty()
  chargePointTotal: number;
  @ApiProperty()
  memberPointTotal: number;
  // 最近一次游戏开始时间
  @Exclude()
  lastMatchTime: Date;
}
