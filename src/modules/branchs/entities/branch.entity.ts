import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Base } from '../../../utils/base.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { Client } from '../../../modules/clients/entities/client.entity';
import { Service } from '../../../modules/services/entities/service.entity';

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

  @Index()
  @Column('int')
  user_id: number;

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

  @OneToMany(() => Client, (client) => client.branch)
  clients: Client[];

  @JoinTable({
    name: 'branchs_services',
    joinColumn: {
      name: 'branch_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => Service, (service) => service.branchs, { cascade: true })
  services: Service[];
}
