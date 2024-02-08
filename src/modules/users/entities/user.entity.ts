import { Entity, Column, Index, OneToMany } from 'typeorm';
import { compare } from 'bcrypt';
import { createPasswordHashed } from '../../../utils/password';

import { BadRequestError } from '../../../http-exceptions/errors/types/BadRequestError';
import { UnauthorizedError } from '../../../http-exceptions/errors/types/UnauthorizedError';

import { Base } from '../../../utils/base.entity';

import { Branch } from '../../../modules/branchs/entities/branch.entity';
import { ICreateUserData, IUpdateUserData } from '../types/user.types';

const isValidEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new BadRequestError(`Format email ${email} invalid`);
  } else {
    return email;
  }
};

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

  static async create(data: ICreateUserData): Promise<User> {
    const userItem = new User();
    const passwordHashed = await createPasswordHashed(data.password);

    Object.assign(userItem, data);
    userItem.password = passwordHashed;
    data.user_email && isValidEmail(data.user_email);
    return userItem;
  }

  static async update(
    data: IUpdateUserData,
    userPassword: string,
  ): Promise<User> {
    const userItem = new User();

    const { current_password, ...rest } = data;

    if (current_password !== undefined && rest.password !== undefined) {
      const isMatch = await compare(current_password, userPassword);
      if (!isMatch) {
        throw new UnauthorizedError('Password is not valid');
      }
    } else if (current_password !== undefined || rest.password !== undefined) {
      throw new BadRequestError(
        'Both current_password and password are required!',
      );
    }

    const passwordHashed = data.password
      ? await createPasswordHashed(data.password)
      : undefined;

    Object.assign(userItem, rest);
    userItem.password = passwordHashed;
    rest.user_email && isValidEmail(rest.user_email);
    return userItem;
  }
}
