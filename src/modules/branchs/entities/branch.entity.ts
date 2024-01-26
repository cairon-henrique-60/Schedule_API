import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../utils/base.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Entity('branchs')
export class Branch extends Base {
  @Index()
  @Column('varchar')
  branch_name: string;

  @Column('varchar', { nullable: true, length: 14 })
  cnpj: string;

  @Column('varchar')
  street: string;

  @Column('varchar', { length: 8 })
  cep: string;

  @Index()
  @Column('varchar')
  city: string;

  @Column('varchar')
  user_id: string;

  @Column('varchar')
  district: string;

  @Column('varchar', { length: 10 })
  local_number: string;

  @Column('varchar', { nullable: true })
  branch_phone: string;

  @Column('varchar')
  complements: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
