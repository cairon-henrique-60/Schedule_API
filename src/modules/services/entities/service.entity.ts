import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { Base } from '../../../utils/base.entity';

import { Branch } from '../../branchs/entities/branch.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('services')
export class Service extends Base {
  @Column('varchar')
  service_name: string;

  @Column('int')
  service_value: number;

  @Column('varchar')
  expected_time: string;

  @Column({ type: 'varchar', default: true })
  is_active: boolean;

  @Index()
  @Column('int')
  user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Branch, (branch) => branch.services)
  @JoinTable({
    name: 'branchs_services',
    joinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'branch_id',
      referencedColumnName: 'id',
    },
  })
  branchs: Branch[];
}
