import { ApiProperty } from '@nestjs/swagger';

export class PointInfoDto {
  @ApiProperty()
  steamId!: number;
  @ApiProperty()
  title!: {
    cn: string;
    en: string;
  };
  @ApiProperty()
  seasonPoint?: number;
  @ApiProperty()
  memberPoint?: number;
}
