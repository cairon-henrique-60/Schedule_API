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

import { BadRequestError } from '../../../http-exceptions/errors/types/BadRequestError';

import { Base } from '../../../utils/base.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { Client } from '../../../modules/clients/entities/client.entity';
import { Service } from '../../../modules/services/entities/service.entity';

import { ICreateBranchData, IUpdateBranchData } from '../types/branch.types';

function formatHour(hour: string): string | null {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regex.test(hour)) {
    throw new BadRequestError(`Format hour ${hour} invalid`);
  } else {
    return hour;
  }
}

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

  @Column('varchar', { length: 5 })
  opening_hours: string;

  @Column('varchar', { length: 5 })
  closing_hours: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Client, (client) => client.branch, { eager: true })
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
  @ManyToMany(() => Service, (service) => service.branchs, {
    cascade: true,
    eager: true,
  })
  services: Service[];

  static create(data: ICreateBranchData): Branch {
    const branchItem = new Branch();
    Object.assign(branchItem, data);
    branchItem.opening_hours = formatHour(data.opening_hours);
    branchItem.closing_hours = formatHour(data.closing_hours);
    return branchItem;
  }

  static update(data: IUpdateBranchData): Branch {
    const branchItem = new Branch();
    Object.assign(branchItem, data);
    branchItem.opening_hours =
      data.opening_hours && formatHour(data.opening_hours);
    branchItem.closing_hours =
      data.closing_hours && formatHour(data.closing_hours);
    return branchItem;
  }
}
