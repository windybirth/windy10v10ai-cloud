import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class AddAllSeasonPointDto {
  @ApiProperty()
  point: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startFrom: Date;
}
