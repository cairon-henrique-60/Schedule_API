import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/lib/database/database.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { BranchsModule } from './branchs/branchs.module';
import { ConfigAppModule } from './config/configAPP.module';
import { ServicesModule } from './services/services.module';
import { ClientsModule } from './clients/clients.module';
import { UploadPhotoModule } from './upload/upload-photo/upload-photo.module';
import { UserPhotoModule } from './user-photo/user-photo.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BranchsModule,
    ServicesModule,
    DatabaseModule,
    ConfigAppModule,
    ClientsModule,
    UploadPhotoModule,
    UserPhotoModule,
  ],
})
export class ScheduleModule {}
