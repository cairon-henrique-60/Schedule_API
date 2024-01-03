import { Base } from 'src/Base_Repository/entitie/base.entity';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

import bcrypt from 'bcrypt';

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
}
