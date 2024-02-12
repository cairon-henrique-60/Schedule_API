import { Module } from '@nestjs/common';
import { UploadPhotoService } from './service/upload-photo.service';
import { UploadPhotoController } from './controller/upload-photo.controller';

@Module({
  controllers: [UploadPhotoController],
  providers: [UploadPhotoService],
})
export class UploadPhotoModule {}
