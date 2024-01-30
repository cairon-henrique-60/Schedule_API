import { Module } from '@nestjs/common';

import { BranchsService } from '../branchs/service/branchs.service';
import { branchsProviders } from '../branchs/provider/branch.providers';

import { ClientsService } from './services/clients.service';
import { clientsProviders } from './provider/clients.providers';
import { ClientsController } from './controller/clients.controller';
import { servicesProviders } from '../services/provider/services.providers';
import { ServicesService } from '../services/services/services.service';
import { usersProviders } from '../users/provider/user.providers';
import { UserService } from '../users/service/user.service';

@Module({
  controllers: [ClientsController],
  providers: [
    ...servicesProviders,
    ...clientsProviders,
    ...branchsProviders,
    ...usersProviders,
    ServicesService,
    ClientsService,
    BranchsService,
    UserService,
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
