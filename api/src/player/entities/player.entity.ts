import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
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
  @IsOptional()
  @IsNumber()
  seasonPointTotal: number;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  memberPointTotal: number;
  // 行为分
  @ApiProperty()
  conductPoint: number;
  // 最近一次游戏开始时间
  @Exclude()
  lastMatchTime: Date;
  // 赛季等级
  @ApiPropertyOptional()
  firstSeasonLevel?: number;
  @ApiPropertyOptional()
  secondSeasonLevel?: number;
  @ApiPropertyOptional()
  thirdSeasonLevel?: number;
}
