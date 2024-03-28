import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Заголовок не может быть пустым' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Описание не может быть пустым' })
  description: string;
}
