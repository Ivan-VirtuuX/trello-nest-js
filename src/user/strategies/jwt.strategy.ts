import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'kkuie44oirgh3647sjj',
    });
  }

  async validate(payload: { username: string; email: string }) {
    const data = {
      username: payload.username,
      email: payload.email,
    };

    const user = await this.userService.findBy(data);

    if (!user)
      throw new UnauthorizedException({ message: 'Пользователь не найден' });

    return {
      userId: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
