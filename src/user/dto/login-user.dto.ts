import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  username?: string;

  @ApiProperty()
  @IsEmail(undefined, { message: 'Некорректный формат почты' })
  email?: string;

  @ApiProperty()
  @Length(8, 32, { message: 'Длина пароля должна быть минимум 8 символов' })
  password?: string;
}
