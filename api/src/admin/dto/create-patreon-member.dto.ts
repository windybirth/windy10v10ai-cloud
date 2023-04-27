import { ApiProperty } from '@nestjs/swagger';

export class CreatePatreonMemberDto {
  @ApiProperty({
    type: [Number],
  })
  steamIds!: number[];
}
