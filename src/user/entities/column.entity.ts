import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '@user/entities/user.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ColumnEntity extends AbstractEntity<ColumnEntity> {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  createdAt: Date;
}
