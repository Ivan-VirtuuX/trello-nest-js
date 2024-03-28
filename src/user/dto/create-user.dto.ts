import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @Length(4, 20, {
    message: 'Длина имени должна быть от 4 до 20 символов',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Почта не может быть пустой' })
  @IsEmail(undefined, {
    message: 'Некорректный формат почты',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @Length(8, 32, {
    message: 'Длина пароля должна быть минимум 8 символов',
  })
  password?: string;
}
