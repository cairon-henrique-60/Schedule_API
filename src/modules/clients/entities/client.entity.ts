import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../utils/base.entity';
import { Branch } from '../../../modules/branchs/entities/branch.entity';

@Entity('clients')
export class Client extends Base {
  @Index()
  @Column('varchar')
  client_name: string;

  @Column('varchar')
  first_name: string;

  @Column('varchar')
  birth_date: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Index()
  @Column('int')
  branch_id: number;

  @ManyToOne(() => Branch, (branch) => branch.id)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
