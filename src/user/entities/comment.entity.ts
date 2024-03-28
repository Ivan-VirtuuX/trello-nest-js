import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';
import { UserEntity } from '@user/entities/user.entity';
import { CardEntity } from '@user/entities/card.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CommentEntity extends AbstractEntity<CommentEntity> {
  @ManyToOne(() => CardEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  @ApiProperty()
  card: CardEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  @ApiProperty()
  user: UserEntity;

  @Column()
  @ApiProperty()
  text: string;

  @Column()
  @ApiProperty()
  createdAt: Date;
}
