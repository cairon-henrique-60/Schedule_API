import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { createPasswordHashed } from 'src/utils/password';

import { User } from '../entities/user.entity';
import { IUser } from '../interface/user.interface';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { user_email: email } });
  }

  async findAll(params: IUser): Promise<User[]> {
    return this.userRepository.find(params);
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

    await this.userRepository.save(user);

    return this.findOneByEmail(rest.user_email);
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
