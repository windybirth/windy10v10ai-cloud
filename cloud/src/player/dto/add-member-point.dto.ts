import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddMemberPointDto {
  @IsNumber()
  @ApiProperty()
  steamId: number;

  @IsNumber()
  @ApiProperty()
  point: number;
}
