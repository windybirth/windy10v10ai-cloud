import { ApiProperty } from '@nestjs/swagger';

export class CreateAfdianMemberDto {
  @ApiProperty()
  steamId!: number;
  @ApiProperty()
  month!: number;
}
