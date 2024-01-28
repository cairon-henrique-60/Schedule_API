import { Module } from '@nestjs/common';

import { BranchsController } from './controller/branchs.controller';

import { BranchsService } from './service/branchs.service';
import { UserService } from '../users/service/user.service';
import { ServicesService } from '../services/services/services.service';

import { branchsProviders } from './provider/branch.providers';
import { usersProviders } from '../users/provider/user.providers';
import { servicesProviders } from '../services/provider/services.providers';

@Module({
  controllers: [BranchsController],
  providers: [
    ...servicesProviders,
    ...branchsProviders,
    ...usersProviders,
    ServicesService,
    BranchsService,
    UserService,
  ],
  exports: [BranchsService],
})
export class BranchsModule {}
