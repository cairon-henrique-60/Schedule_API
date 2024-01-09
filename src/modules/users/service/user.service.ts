import { Injectable, Inject } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { compare } from 'bcrypt';

import { createPasswordHashed } from 'src/utils/password';
import { NotFoundError } from 'src/http-exceptions/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/http-exceptions/errors/types/UnauthorizedError';

import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

import { QueryUserDTO } from '../dto/querys-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'user_name',
        'user_email',
        'phone_number',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundError('User not found!');
    }

    return user;
  }

  // This function by authenticate
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_email: email },
    });

    if (!user) {
      throw new NotFoundError('User not found!');
    }

    return user;
  }

  async findAll(params: QueryUserDTO): Promise<User[]> {
    const whereClause: QueryUserDTO = {};

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        whereClause[key] = Like(`%${params[key]}%`);
      }
    });

    return this.userRepository.find({
      select: [
        'id',
        'user_name',
        'user_email',
        'phone_number',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
      where: whereClause,
    });
  }

  async createUser({ password, ...rest }: CreateUserDTO): Promise<User> {
    const passwordHashed = await createPasswordHashed(password);

    const user = this.userRepository.create({
      ...rest,
      password: passwordHashed,
    });

    const createdUser = await this.userRepository.save(user);

    const newUser = {
      id: createdUser.id,
      user_name: createdUser.user_name,
      user_email: createdUser.user_email,
      phone_number: createdUser.phone_number,
      createdAt: createdUser.createdAt,
    };

    return newUser as User;
  }

  async updateUser(
    id: string,
    { current_password, ...rest }: UpdateUserDTO,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundError('User not found!');
    }
    if (current_password && rest.password) {
      const isMatch = await compare(current_password, user.password);
      if (!isMatch) {
        throw new UnauthorizedError('Passowrd is not validate');
      }
    }

    await this.userRepository.update(id, rest);

    return this.findOne(id);
  }

  async deleteUser(id: string) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundError('User not found!');

    return this.userRepository.delete(id);
  }
}
