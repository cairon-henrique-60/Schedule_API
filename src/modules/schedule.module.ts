import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class ScheduleModule {}
