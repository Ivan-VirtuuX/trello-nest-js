import { ApiProperty } from '@nestjs/swagger';

export class UpdateColumnDto {
  @ApiProperty({
    required: false,
  })
  name: string;
}
