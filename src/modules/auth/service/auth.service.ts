import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { User } from 'src/modules/users/entities/user.entity';
import { UserService } from 'src/modules/users/service/user.service';
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

    if (!user) throw new NotFoundException('Email or password invalid');

    const isMatch = await compare(pass, user.password);

    if (!isMatch) {
      throw new NotFoundException('Email or password invalid');
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
