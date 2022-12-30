import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerPropertyDto {
  @ApiProperty()
  steamId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  level: number;
}
