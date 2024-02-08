import { Injectable, Inject } from '@nestjs/common';
import { DeleteResult, Like, Repository } from 'typeorm';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';


import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';

import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

import { QueryUserDTO } from '../dto/querys-user.dto';
import { ICreateUserData, IUpdateUserData } from '../types/user.types';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async paginateUser(params: QueryUserDTO): Promise<Pagination<User>> {
    const whereClause: QueryUserDTO = {};

    const { limit, page, ...rest } = params;

    const options: IPaginationOptions = {
      limit,
      page,
    };

    Object.keys(rest).forEach((key) => {
      if (rest[key]) {
        whereClause[key] = Like(`%${rest[key]}%`);
      }
    });

    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder
      .select([
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
        'u.createdAt',
        'u.updatedAt',
        'u.deletedAt',
      ])
      .leftJoinAndSelect('u.branchs', 'branch')
      .where(whereClause);

    return paginate<User>(queryBuilder, options);
  }

  async findOne(id: number): Promise<User> {
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
      relations: ['branchs'],
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
      relations: ['branchs'],
    });
  }

  async createUser(params: CreateUserDTO): Promise<User> {
    const user: ICreateUserData = {
      ...params,
    };

    const userItem = await User.create(user);

    const newUser = await this.userRepository.save(userItem);

    return this.findOne(newUser.id);
  }

  async updateUser(id: number, params: UpdateUserDTO): Promise<User> {
    const user = await this.findOne(id);
    const userEmail = await this.findOneByEmail(user.user_email);

    if (!user) {
      throw new NotFoundError('User not found!');
    }

    const userItem: IUpdateUserData = {
      ...params,
    };

    const newUser = await User.update(userItem, userEmail.password);

    await this.userRepository.update(id, newUser);

    return this.findOne(id);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundError('User not found!');

    return this.userRepository.delete(id);
  }
}
