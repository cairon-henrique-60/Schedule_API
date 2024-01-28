import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/lib/database/database.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { BranchsModule } from './branchs/branchs.module';
import { ConfigAppModule } from './config/configAPP.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BranchsModule,
    ServicesModule,
    DatabaseModule,
    ConfigAppModule,
  ],
})
export class ScheduleModule {}
