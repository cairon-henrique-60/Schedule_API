import { FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export interface IUser extends FindManyOptions<User> {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  user_name?: string;
  /**
   *Email of the user.
   *@example levis@gmail.com
   */
  user_email?: string;
  /**
   *Phone number of the user.
   *@example 997203320
   */
  phone_number?: string | null;
  /**
   *Date create of the user.
   *@example 2024-01-06
   */
  createdAt?: string;
  /**
   *Date update of the user.
   *@example 2024-01-06
   */
  updatedAt?: string;
  /**
   *Date delete of the user.
   *@example 2024-01-06
   */
  deletedAt?: string;
}
