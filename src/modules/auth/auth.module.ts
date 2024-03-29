import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

import { UserModule } from 'src/modules/users/user.module';
import { AuthGuard } from './strategies/auth.guard';
import { ENV_VARIABLES } from 'src/config/env.config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: ENV_VARIABLES.JWT_SECRET,
        signOptions: { expiresIn: ENV_VARIABLES.JWT_EXPIRES_IN },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
