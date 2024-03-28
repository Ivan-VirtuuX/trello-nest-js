import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddColumnDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Название колонки не может быть пустым' })
  name: string;
}
