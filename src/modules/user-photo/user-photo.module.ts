import { Module } from '@nestjs/common';

import { UserPhotoController } from './controller/user-photo.controller';

import { UserService } from '../users/service/user.service';
import { UserPhotoService } from './service/user-photo.service';

import { usersProviders } from '../users/provider/user.providers';
import { userPhotoProviders } from './provider/user-photo.providers';
import { UploadPhotoService } from '../upload/upload-photo/service/upload-photo.service';

@Module({
  controllers: [UserPhotoController],
  providers: [
    ...userPhotoProviders,
    ...usersProviders,
    UploadPhotoService,
    UserPhotoService,
    UserService,
  ],
  exports: [UserService],
})
export class UserPhotoModule {}
