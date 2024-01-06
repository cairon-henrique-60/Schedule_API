import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: string;

  @UpdateDateColumn({
    type: 'date',
    onUpdate: 'NOW()',
    default: null,
    nullable: true,
  })
  updatedAt: string | null;

  @DeleteDateColumn({ type: 'date', default: null })
  deletedAt: string | null;
}
