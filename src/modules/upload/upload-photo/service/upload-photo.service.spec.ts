import { Test, TestingModule } from '@nestjs/testing';
import { UploadPhotoService } from './upload-photo.service';
import { CreateUploadDto } from '../dto/create-upload-photo.dto';

describe('UploadService', () => {
  let fileService: UploadPhotoService;

  const mockService = {
    upload: jest.fn(),
    bulkUpload: jest.fn(),
  };

  const mockFile: CreateUploadDto = {
    fieldname: 'file',
    originalname: 'ArquivoPadrao - Copia.jpeg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('fake image content 2'),
    size: 45100,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadPhotoService,
        { provide: UploadPhotoService, useValue: mockService },
      ],
    }).compile();

    fileService = module.get<UploadPhotoService>(UploadPhotoService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('upload', () => {
    it('should upload a single file', async () => {
      mockService.upload.mockResolvedValue('mocked result');

      const result = await fileService.upload(mockFile);

      expect(mockService.upload).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual('mocked result');
    });

    it('should throw BadRequestError if file is not an image', async () => {
      mockService.upload.mockRejectedValue(new Error('File is not an image!'));

      await expect(fileService.upload(mockFile)).rejects.toThrowError(Error);
      expect(mockService.upload).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('bulkUpload', () => {
    it('should upload an array of files', async () => {
      const mockFiles: CreateUploadDto[] = [mockFile, mockFile];

      mockService.bulkUpload.mockResolvedValue([
        'mocked result 1',
        'mocked result 2',
      ]);

      const result = await fileService.bulkUpload(mockFiles);

      expect(mockService.bulkUpload).toHaveBeenCalledWith(mockFiles);
      expect(result).toEqual(['mocked result 1', 'mocked result 2']);
    });

    it('should throw BadRequestError for non-image files in bulk upload', async () => {
      const mockFiles: CreateUploadDto[] = [
        mockFile,
        { ...mockFile, mimetype: 'application/pdf' },
      ];

      mockService.bulkUpload.mockRejectedValue(
        new Error('File ... is not an image!'),
      );

      await expect(fileService.bulkUpload(mockFiles)).rejects.toThrowError(
        Error,
      );
      expect(mockService.bulkUpload).toHaveBeenCalledWith(mockFiles);
    });
  });
});
