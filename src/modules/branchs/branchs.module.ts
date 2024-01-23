import { Module } from '@nestjs/common';

import { BranchsService } from './service/branchs.service';
import { UserService } from '../users/service/user.service';
import { BranchsController } from './controller/branchs.controller';

import { branchsProviders } from './provider/branch.providers';
import { usersProviders } from '../users/provider/user.providers';

@Module({
  controllers: [BranchsController],
  providers: [
    ...branchsProviders,
    ...usersProviders,
    BranchsService,
    UserService,
  ],
  exports: [BranchsService],
})
export class BranchsModule {}
