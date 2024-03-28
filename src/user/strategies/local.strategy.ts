import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Неверная почта или пароль');
    return user;
  }
}
