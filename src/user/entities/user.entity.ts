import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { ColumnEntity } from '@user/entities/column.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { CardEntity } from '@user/entities/card.entity';
import { CommentEntity } from '@user/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity extends AbstractEntity<UserEntity> {
  @Column({ length: 20 })
  @ApiProperty()
  username: string;

  @Column()
  password?: string;

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  createdAt: Date;

  @OneToMany(() => ColumnEntity, (column) => column.user, { cascade: true })
  columns: ColumnEntity[];

  @OneToMany(() => CardEntity, (card) => card.user, { cascade: true })
  cards: CardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, { cascade: true })
  comments: CommentEntity[];
}
