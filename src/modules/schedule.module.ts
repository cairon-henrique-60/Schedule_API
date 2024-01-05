import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/lib/database/database.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
})
export class ScheduleModule {}
