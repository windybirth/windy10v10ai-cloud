import { ApiProperty } from '@nestjs/swagger';

export class AddMemberPointDto {
  @ApiProperty()
  steamId: number;
  @ApiProperty()
  point: number;
}
