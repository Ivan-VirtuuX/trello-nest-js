import { PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
