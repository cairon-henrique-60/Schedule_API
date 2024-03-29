import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../utils/base.entity';
import { Branch } from '../../../modules/branchs/entities/branch.entity';
import { ICreateClientData, IUpdateClientData } from '../types/clients.type';

@Entity('clients')
export class Client extends Base {
  @Index()
  @Column('varchar')
  client_name: string;

  @Column('varchar')
  first_name: string;

  @Column('varchar')
  birth_date: string;

  @Column('varchar')
  client_phone: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Index()
  @Column('int')
  branch_id: number;

  @ManyToOne(() => Branch, (branch) => branch.id)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  static create(data: ICreateClientData): Client {
    const clientItem = new Client();

    Object.assign(clientItem, data);
    return clientItem;
  }

  static update(data: IUpdateClientData): Client {
    const clientItem = new Client();

    Object.assign(clientItem, data);
    return clientItem;
  }
}
