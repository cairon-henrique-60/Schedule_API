import { FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export interface IUser extends FindManyOptions<User> {
  user_name?: string;
  user_email?: string;
  phone_number?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
