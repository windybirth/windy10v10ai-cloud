import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class ResetSeasonPoint {
  @Max(100)
  @Min(1)
  @IsNumber()
  @ApiProperty({
    description: 'Percent of season point to reset, 1-100',
    default: 40,
  })
  resetPercent: number;
}
