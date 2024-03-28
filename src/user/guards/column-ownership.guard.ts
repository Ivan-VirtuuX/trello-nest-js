import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '@user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const user = await this.repository.findOne({
      where: { id: req.user.userId },
      relations: ['columns'],
    });

    const column = user.columns.find(
      (column) => column.id === +req.params.columnId,
    );

    if (column) return true;
    else throw new NotFoundException('Нет доступа');
  }
}
