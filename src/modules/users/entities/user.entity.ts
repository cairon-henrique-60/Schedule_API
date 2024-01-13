import { Base } from '../../../utils/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('user')
export class User extends Base {
  @Column('varchar')
  user_name: string;

  @Column({ length: 255 })
  password: string;

  @Column('varchar')
  user_email: string;

  @Column('varchar', { nullable: true })
  phone_number: string | null;
}
