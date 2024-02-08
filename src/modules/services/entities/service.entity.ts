import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { BadRequestError } from '../../../http-exceptions/errors/types/BadRequestError';

import { Base } from '../../../utils/base.entity';

import { Branch } from '../../branchs/entities/branch.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { ICreateServiceData, IUpdateServiceData } from '../types/services.type';

const isValidExpectTime = (time: string): string | null => {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(time)) {
    throw new BadRequestError(`Format time ${time} invalid`);
  } else {
    return time;
  }
};

@Entity('services')
export class Service extends Base {
  @Column('varchar')
  service_name: string;

  @Column('int')
  service_value: number;

  @Column('varchar')
  expected_time: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Index()
  @Column('int')
  user_id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Branch, (branch) => branch.services)
  branchs: Branch[];

  static create(data: ICreateServiceData): Service {
    const serviceItem = new Service();

    Object.assign(serviceItem, data);
    serviceItem.expected_time = isValidExpectTime(data.expected_time);
    return serviceItem;
  }

  static update(data: IUpdateServiceData): Service {
    const serviceItem = new Service();

    Object.assign(serviceItem, data);
    serviceItem.expected_time =
      data.expected_time && isValidExpectTime(data.expected_time);
    return serviceItem;
  }
}
