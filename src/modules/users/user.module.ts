import { Module } from '@nestjs/common';


import { UserController } from './controller/user.controller';
import { usersProviders } from './provider/user.providers';
import { UserService } from './service/user.service';

@Module({
  controllers: [UserController],
  providers: [...usersProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
