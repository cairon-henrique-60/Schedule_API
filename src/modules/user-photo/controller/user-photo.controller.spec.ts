import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../../modules/users/entities/user.entity';

import { UserPhoto } from '../entities/user-photo.entity';
import { UserPhotoController } from './user-photo.controller';
import { UserPhotoService } from '../service/user-photo.service';

import { QuerysUserPhotoDto } from '../dto/querys-user-photo.dto';
import { CreateUpdateUserPhotoDto } from '../dto/createOrUpdate-user-photo.dto';

describe('UserPhotoController unit tests', () => {
  let userPhotoController: UserPhotoController;

  const mockService = {
    paginateUserPhoto: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = new User();
  const mockUserPhoto = new UserPhoto();

  mockUser.id = 1;
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';

  mockUserPhoto.id = 1;
  mockUserPhoto.original_name = '616631 - Copia.jpeg';
  mockUserPhoto.size = 912018;
  mockUserPhoto.url = 'https://testeOfTheUpload';
  mockUserPhoto.createdAt = '2024-02-22T08:25:10.000Z';
  mockUserPhoto.updatedAt = '2024-02-22T08:25:10.000Z';
  mockUserPhoto.deletedAt = null;
  mockUserPhoto.user_id = 1;
  mockUserPhoto.user = mockUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPhotoController],
      providers: [{ provide: UserPhotoService, useValue: mockService }],
    }).compile();

    userPhotoController = module.get<UserPhotoController>(UserPhotoController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userPhotoController).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginante return an ampty array when no photos', async () => {
      const params: QuerysUserPhotoDto = {
        original_name: mockUserPhoto.original_name,
        size: mockUserPhoto.size,
        url: mockUserPhoto.url,
        user_id: mockUserPhoto.user_id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await userPhotoController.paginate(params);

      expect(mockService.paginateUserPhoto).toHaveBeenCalledTimes(1);
      expect(mockService.paginateUserPhoto).toHaveBeenCalledWith(params);
    });
  });

  describe('findAll', () => {
    it('should return an ampty array when no photos', async () => {
      const params: QuerysUserPhotoDto = {
        original_name: mockUserPhoto.original_name,
        size: mockUserPhoto.size,
        url: mockUserPhoto.url,
        user_id: mockUserPhoto.user_id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await userPhotoController.findAll(params);

      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(mockService.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a photo object when a valid id is provided', async () => {
      await userPhotoController.findOne(String(mockUserPhoto.id));

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith(mockUserPhoto.id);
    });
  });

  describe('create', () => {
    it('should create a photo with valid input data', async () => {
      const mockFile: CreateUpdateUserPhotoDto = {
        fieldname: 'file',
        originalname: 'ArquivoPadrao - Copia.jpeg',
        encoding: '7bit',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('fake image content 2'),
        size: 45100,
      };

      await userPhotoController.create(String(mockUserPhoto.id), mockFile);

      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(mockService.create).toHaveBeenCalledWith(
        mockUserPhoto.id,
        mockFile,
      );
    });
  });

  describe('update', () => {
    it('should update a photo with valid input data', async () => {
      const mockFile: CreateUpdateUserPhotoDto = {
        fieldname: 'file',
        originalname: 'ArquivoPadrao - Copia2.jpeg',
        encoding: '7bit',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('fake image content 2'),
        size: 45100,
      };

      const mockUserPhotoId = 1;

      jest.spyOn(mockService, 'update').mockImplementation(async (id, dto) => {
        expect(id).toBe(mockUserPhotoId);
        expect(dto).toEqual(mockFile);
      });

      await userPhotoController.update(mockUserPhotoId.toString(), mockFile);

      expect(mockService.update).toHaveBeenCalledTimes(1);
    });

    describe('delete', () => {
      it('should delete a photo when a valid id is provided', async () => {
        await userPhotoController.remove(String(mockUserPhoto.id));

        expect(mockService.remove).toHaveBeenCalledTimes(1);
        expect(mockService.remove).toHaveBeenCalledWith(mockUserPhoto.id);
      });
    });
  });
});
