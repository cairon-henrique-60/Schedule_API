import { Test, TestingModule } from '@nestjs/testing';
import { UploadPhotoController } from './upload-photo.controller';
import { UploadPhotoService } from '../service/upload-photo.service';

describe('UploadController', () => {
  let controller: UploadPhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadPhotoController],
      providers: [UploadPhotoService],
    }).compile();

    controller = module.get<UploadPhotoController>(UploadPhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
