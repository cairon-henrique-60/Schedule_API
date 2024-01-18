import { Module } from '@nestjs/common';

import { ScheduleModule } from './modules/schedule.module';

@Module({
  imports: [ScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
