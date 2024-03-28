import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '@user/strategies/local.strategy';
import { JwtStrategy } from '@user/strategies/jwt.strategy';
import { ColumnEntity } from '@user/entities/column.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ColumnEntity]),
    PassportModule,
    JwtModule.register({
      secret: 'kkuie44oirgh3647sjj',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
