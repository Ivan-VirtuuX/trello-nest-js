import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const user = await this.repository.findOne({
      where: { id: req.user.userId },
      relations: ['comments'],
    });

    const comment = user.comments.find(
      (comment) => comment.id === +req.params.commentId,
    );

    if (comment) return true;
    else throw new NotFoundException('Нет доступа');
  }
}
