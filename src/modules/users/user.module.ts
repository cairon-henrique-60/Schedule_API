import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { UserController } from './controller/user.controller';
import { usersProviders } from './provider/user.providers';
import { UserService } from './service/user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...usersProviders, UserService],
})
export class UserModule {}
