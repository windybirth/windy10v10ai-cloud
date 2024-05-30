import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class AddAllSeasonPointDto {
  @ApiProperty({ default: 1000 })
  @IsNumber()
  point: number;

  @ApiProperty({
    default: (() => {
      const now = new Date();
      now.setUTCHours(0, 0, 0, 0);
      return now;
    })(),
  })
  @Type(() => Date)
  @IsDate()
  startFrom: Date;
}
