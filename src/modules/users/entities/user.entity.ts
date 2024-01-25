import { Entity, Column, Index, OneToMany } from 'typeorm';

import { Base } from '../../../utils/base.entity';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

@Entity('user')
export class User extends Base {
  @Index()
  @Column('varchar')
  user_name: string;

  @Column({ length: 255 })
  password: string;

  @Column('varchar')
  user_email: string;

  @Column('varchar', { nullable: true })
  phone_number: string | null;

  @OneToMany(() => Branch, (branch) => branch.user)
  branchs: Branch[];
}
