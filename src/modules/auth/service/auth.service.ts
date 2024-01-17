import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { User } from '../../../modules/users/entities/user.entity';
import { UserService } from '../../../modules/users/service/user.service';
import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';
import { UnauthorizedError } from '../../../http-exceptions/errors/types/UnauthorizedError';

import { AccessDTO } from '../dto/access.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user_email: string, pass: string): Promise<AccessDTO> {
    const user: User | undefined = await this.usersService
      .findOneByEmail(user_email)
      .catch(() => undefined);

    if (!user) throw new NotFoundError('Email or password invalid');

    const isMatch = await compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedError('Password is not validate');
    }

    return {
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
      accessToken: this.jwtService.sign({
        id: user.id,
        name: user.user_name,
        email: user.user_email,
      }),
    };
  }
}
