import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/lib/database/database.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { BranchsModule } from './branchs/branchs.module';
import { ConfigAppModule } from './config/configAPP.module';

@Module({
  imports: [
    ConfigAppModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    BranchsModule,
  ],
})
export class ScheduleModule {}
