import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LoginUserDto } from '@user/dto/login-user.dto';
import { AddColumnDto } from '@user/dto/add-column.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateCardDto } from '@user/dto/update-card.dto';
import { CreateCardDto } from '@user/dto/create-card.dto';
import { UpdateColumnDto } from '@user/dto/update-column.dto';
import { CreateCommentDto } from '@user/dto/create-comment.dto';

import { UserEntity } from '@user/entities/user.entity';
import { CardEntity } from '@user/entities/card.entity';
import { ColumnEntity } from '@user/entities/column.entity';
import { CommentEntity } from '@user/entities/comment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const users = await this.repository.find();
    const user = users.find((user) => user.email === email);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  generateJwtToken(userData: UserEntity) {
    const payload = {
      username: userData.username,
      email: userData.email,
    };
    return this.jwtService.sign(payload);
  }

  async login(user: UserEntity) {
    const userData = { ...user };

    return {
      ...userData,
      token: this.generateJwtToken(userData),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.password, salt);
      const users = await this.repository.find();

      if (!users.find((user) => user.email === dto.email)) {
        const userData = await this.create({
          username: dto.username,
          email: dto.email,
          password: hash,
        });

        return {
          username: userData.username,
          email: userData.email,
          token: this.generateJwtToken(userData),
        };
      }
      throw new ForbiddenException('Адрес электронной почты занят');
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity({
      ...createUserDto,
      columns: [],
      createdAt: new Date(),
    });
    return this.entityManager.save(user);
  }

  async findBy(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.repository.findOneBy(loginUserDto);
  }

  async getById(id: number) {
    return await this.repository.findOne({
      where: { id },
      relations: {
        columns: true,
      },
    });
  }

  async getColumns(userId: number) {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { columns: true },
    });

    return user.columns;
  }

  async addColumn(userId: number, dto: AddColumnDto) {
    const user = await this.repository.findOneBy({ id: userId });

    const column = new ColumnEntity({
      user,
      name: dto.name,
      createdAt: new Date(),
    });
    return await this.entityManager.save(column);
  }

  async deleteColumn(userId: number, columnId: number) {
    const column = await this.entityManager.findOneBy(ColumnEntity, {
      id: columnId,
      user: {
        id: userId,
      },
    });

    if (column) {
      await this.entityManager.remove(column);

      return {
        message: 'Колонка успешно удалена',
      };
    }
    throw new NotFoundException('Колонка не найдена');
  }

  async updateColumn(userId: number, columnId: number, dto: UpdateColumnDto) {
    const column = await this.entityManager.findOneBy(ColumnEntity, {
      id: columnId,
      user: {
        id: userId,
      },
    });

    if (column) {
      column.name = dto.name || column.name;

      return await this.entityManager.save(column);
    }
  }

  async getCards(userId: number, columnId: number) {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['cards', 'cards.column'],
    });
    return user.cards.filter((card) => card.column.id == columnId);
  }

  async addCard(userId: number, columnId: number, dto: CreateCardDto) {
    const user = await this.repository.findOneBy({ id: userId });
    const column = await this.entityManager.findOneBy(ColumnEntity, {
      id: columnId,
      user: {
        id: userId,
      },
    });

    const card = new CardEntity({
      column,
      user,
      title: dto.title,
      description: dto.description,
      createdAt: new Date(),
    });

    return await this.entityManager.save(card);
  }

  async deleteCard(userId: number, cardId: number) {
    const card = await this.entityManager.findOneBy(CardEntity, {
      id: cardId,
      user: {
        id: userId,
      },
    });

    if (card) {
      await this.entityManager.remove(card);

      return {
        message: 'Карточка успешно удалена',
      };
    }
    throw new NotFoundException('Карточка не найдена');
  }

  async updateCard(userId: number, cardId: number, dto: UpdateCardDto) {
    const card = await this.entityManager.findOneBy(CardEntity, {
      id: cardId,
      user: {
        id: userId,
      },
    });

    if (card) {
      card.title = dto.title || card.title;
      card.description = dto.description || card.description;

      return await this.entityManager.save(card);
    }
  }

  async addComment(userId: number, cardId: number, dto: CreateCommentDto) {
    const user = await this.repository.findOneBy({ id: userId });
    const card = await this.entityManager.findOneBy(CardEntity, {
      id: cardId,
      user: {
        id: userId,
      },
    });

    const comment = new CommentEntity({
      card,
      user,
      text: dto.text,
      createdAt: new Date(),
    });

    return await this.entityManager.save(comment);
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.entityManager.findOneBy(CommentEntity, {
      id: commentId,
      user: {
        id: userId,
      },
    });

    if (comment) {
      await this.entityManager.remove(comment);

      return {
        message: 'Комментарий успешно удален',
      };
    }
    throw new NotFoundException('Комментарий не найден');
  }

  async updateComment(
    userId: number,
    commentId: number,
    dto: CreateCommentDto,
  ) {
    const comment = await this.entityManager.findOneBy(CommentEntity, {
      id: commentId,
      user: {
        id: userId,
      },
    });

    if (comment) {
      comment.text = dto.text || comment.text;

      return await this.entityManager.save(comment);
    }
  }
}
