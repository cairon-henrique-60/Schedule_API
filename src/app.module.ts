import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ScheduleModule } from './modules/schedule.module';

@Module({
  imports: [ConfigModule.forRoot({}), ScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
