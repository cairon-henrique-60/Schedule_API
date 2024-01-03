import { Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  deletedAt: Date;
}
