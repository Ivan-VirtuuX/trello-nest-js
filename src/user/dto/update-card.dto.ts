import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiProperty({
    required: false,
  })
  title: string;

  @ApiProperty({
    required: false,
  })
  description: string;
}
