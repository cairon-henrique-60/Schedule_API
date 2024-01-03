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

    const isMatch = await compare(pass, user.password);

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    return {
      user: user,
      accessToken: this.jwtService.sign({ ...user }),
    };
  }
}
