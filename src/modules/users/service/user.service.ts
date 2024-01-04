import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

import { createPasswordHashed } from 'src/utils/password';

import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

import { IUser } from '../interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'user_name',
        'user_email',
        'phone_number',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  // This function by authenticate
  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { user_email: email } });
  }

  async findAll(params: IUser): Promise<User[]> {
    const whereClause: IUser = {};

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
    const isUser = await this.findOneByEmail(rest.user_email);

    if (isUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

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
    id: number,
    { current_password, ...rest }: UpdateUserDTO,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (current_password && user?.password !== current_password) {
      throw new HttpException(
        'Error in current password',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.update(id, rest);

    return this.findOne(id);
  }

  async deleteUser(id: number) {
    const isUser = await this.findOne(id);

    if (!isUser)
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);

    return this.userRepository.delete(id);
  }
}
