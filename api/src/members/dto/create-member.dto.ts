import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty()
  steamId!: number;
  @ApiProperty()
  month!: number;
}
