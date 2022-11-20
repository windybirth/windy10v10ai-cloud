import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class AddMemberPointDto {
  @IsNumberString()
  @ApiProperty()
  steamId: number;

  @IsNumberString()
  @ApiProperty()
  point: number;
}
