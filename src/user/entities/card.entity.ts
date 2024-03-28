import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';
import { ColumnEntity } from '@user/entities/column.entity';
import { UserEntity } from '@user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CardEntity extends AbstractEntity<CardEntity> {
  @ManyToOne(() => ColumnEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  column: ColumnEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  createdAt: Date;
}
