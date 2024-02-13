import { Test, TestingModule } from '@nestjs/testing';

import { UploadPhotoController } from './upload-photo.controller';
import { UploadPhotoService } from '../service/upload-photo.service';

import { CreateUploadDto } from '../dto/create-upload-photo.dto';

describe('UploadController unit tests', () => {
  let fileController: UploadPhotoController;

  const mockService = {
    upload: jest.fn(),
    bulkUpload: jest.fn(),
  };

  const mockFile: CreateUploadDto = {
    fieldname: 'file',
    originalname: 'ArquivoPadrao - Copia.jpeg',
    encoding: '7bit',
    mimetype:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from('fake image content 2'),
    size: 45100,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadPhotoController],
      providers: [{ provide: UploadPhotoService, useValue: mockService }],
    }).compile();

    fileController = module.get<UploadPhotoController>(UploadPhotoController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(fileController).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload single file', async () => {
      await fileController.uploadFile(mockFile);

      expect(mockService.upload).toHaveBeenCalledTimes(1);
      expect(mockService.upload).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('uploadBulkFile', () => {
    it('should upload list file', async () => {
      const bulkFile: CreateUploadDto[] = [
        {
          fieldname: 'file',
          originalname: 'ArquivoTest - Copia.jpeg',
          encoding: '7bit',
          mimetype:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: Buffer.from('fake image content 1'),
          size: 45100,
        },
        {
          fieldname: 'file',
          originalname: 'ArquivoPadrao - Copia.jpeg',
          encoding: '7bit',
          mimetype:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: Buffer.from('fake image content 2'),
          size: 45100,
        },
      ];

      await fileController.uploadBulkFiles(bulkFile);

      expect(mockService.bulkUpload).toHaveBeenCalledTimes(1);
      expect(mockService.bulkUpload).toHaveBeenCalledWith(bulkFile);
    });
  });
});
