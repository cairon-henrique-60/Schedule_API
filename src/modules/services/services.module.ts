import { Module } from '@nestjs/common';

import { UserService } from '../users/service/user.service';
import { ServicesService } from './services/services.service';
import { ServicesController } from './controller/services.controller';

import { servicesProviders } from './provider/services.providers';
import { usersProviders } from '../users/provider/user.providers';

@Module({
  controllers: [ServicesController],
  providers: [
    ...servicesProviders,
    ...usersProviders,
    UserService,
    ServicesService,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
