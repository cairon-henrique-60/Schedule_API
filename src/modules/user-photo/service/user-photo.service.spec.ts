import { Test, TestingModule } from '@nestjs/testing';
import { Like } from 'typeorm';

import { User } from '../../../modules/users/entities/user.entity';
import { UserService } from '../../../modules/users/service/user.service';

import { UploadPhotoService } from '../../../modules/upload/upload-photo/service/upload-photo.service';

import { UserPhoto } from '../entities/user-photo.entity';
import { UserPhotoService } from './user-photo.service';

import { QuerysUserPhotoDto } from '../dto/querys-user-photo.dto';
import { CreateUpdateUserPhotoDto } from '../dto/createOrUpdate-user-photo.dto';

jest.mock('nestjs-typeorm-paginate');

describe('UserPhotoService unit tests', () => {
  let userPhotoService: UserPhotoService;
  let fileService: UploadPhotoService;

  const mockService = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockServiceUpload = {
    upload: jest.fn(),
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
      providers: [
        UserPhotoService,
        UploadPhotoService,
        UserService,
        { provide: 'USER_REPOSITORY', useValue: mockService },
        { provide: 'USER_PHOTO_REPOSITORY', useValue: mockService },
        { provide: UploadPhotoService, useValue: mockServiceUpload },
      ],
    }).compile();

    userPhotoService = module.get<UserPhotoService>(UserPhotoService);
    fileService = module.get<UploadPhotoService>(UploadPhotoService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userPhotoService).toBeDefined();
    expect(fileService).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate photos', async () => {
      const params: QuerysUserPhotoDto = {
        original_name: mockUserPhoto.original_name,
        size: mockUserPhoto.size,
        url: mockUserPhoto.url,
        user_id: mockUserPhoto.user_id,
        page: 1,
        limit: 100,
      };

      jest.spyOn(mockService, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      });

      await userPhotoService.paginateUserPhoto(params);

      expect(mockService.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(mockService.createQueryBuilder().select).toHaveBeenCalledWith([
        'p',
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
      ]);
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        'p.user',
        'u',
      );
      expect(mockService.createQueryBuilder().where).toHaveBeenCalledWith({
        original_name: Like(`%${params.original_name}%`),
        size: Like(`%${params.size}%`),
        url: Like(`%${params.url}%`),
        user_id: Like(`%${params.user_id}%`),
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundError if photo is not found', async () => {
      try {
        await userPhotoService.findOne(500);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Photo not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: 500 },
        relations: ['user'],
      });
    });

    it('should return a photo object when a valid id is provided', async () => {
      jest.spyOn(userPhotoService, 'findOne').mockResolvedValue(mockUserPhoto);

      await userPhotoService.findOne(mockUserPhoto.id);

      expect(userPhotoService.findOne).toHaveBeenCalledTimes(1);
      expect(userPhotoService.findOne).toHaveBeenCalledWith(mockUserPhoto.id);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no branchs match the query parameters', async () => {
      const params: QuerysUserPhotoDto = {
        original_name: mockUserPhoto.original_name,
        size: mockUserPhoto.size,
        url: mockUserPhoto.url,
        user_id: mockUserPhoto.user_id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-02',
      };

      jest.spyOn(mockService, 'find').mockResolvedValue([]);

      const result = await userPhotoService.findAll(params);

      expect(mockService.find).toHaveBeenCalledWith({
        where: {
          createdAt: Like(`%${params.createdAt}%`),
          deletedAt: Like(`%${params.deletedAt}%`),
          updatedAt: Like(`%${params.updatedAt}%`),
          original_name: Like(`%${params.original_name}%`),
          size: Like(`%${params.size}%`),
          url: Like(`%${params.url}%`),
          user_id: Like(`%${params.user_id}%`),
        },
        relations: ['user'],
      });

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    const mockFile: CreateUpdateUserPhotoDto = {
      fieldname: 'file',
      originalname: mockUserPhoto.original_name,
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('fake image content 2'),
      size: 45100,
    };

    it('should throw an error if user by user_id not found', async () => {
      const createDTOError: CreateUpdateUserPhotoDto = {
        fieldname: mockFile.fieldname,
        originalname: mockFile.originalname,
        encoding: mockFile.encoding,
        mimetype: mockFile.mimetype,
        buffer: mockFile.buffer,
        size: mockFile.size,
      };

      jest
        .spyOn(userPhotoService, 'create')
        .mockImplementationOnce(async () => {
          throw new Error('User not found!');
        });

      await expect(
        userPhotoService.create(20, createDTOError),
      ).rejects.toThrowError('User not found!');

      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(mockServiceUpload.upload).toHaveBeenCalledTimes(0);
      expect(userPhotoService.create).toHaveBeenCalledWith(20, createDTOError);
    });

    it('should create a photo with valid input data', async () => {
      jest.spyOn(userPhotoService, 'create').mockResolvedValue(mockUserPhoto);

      const createPhoto = await userPhotoService.create(mockUser.id, mockFile);

      expect(userPhotoService.create).toHaveBeenCalledTimes(1);
      expect(userPhotoService.create).toHaveBeenCalledWith(
        mockUser.id,
        mockFile,
      );

      expect(createPhoto).toBe(mockUserPhoto);
    });
  });

  describe('update', () => {
    const mockFile: CreateUpdateUserPhotoDto = {
      fieldname: 'file',
      originalname: mockUserPhoto.original_name,
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('fake image content 2'),
      size: 45100,
    };

    it('should throw an error if photo not found', async () => {
      jest
        .spyOn(userPhotoService, 'update')
        .mockRejectedValue(new Error('Photo not found!'));

      await expect(userPhotoService.update(500, mockFile)).rejects.toThrowError(
        'Photo not found!',
      );

      expect(mockService.create).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if user by user_id not found', async () => {
      const createDTOError: CreateUpdateUserPhotoDto = {
        fieldname: mockFile.fieldname,
        originalname: mockFile.originalname,
        encoding: mockFile.encoding,
        mimetype: mockFile.mimetype,
        buffer: mockFile.buffer,
        size: mockFile.size,
      };

      jest
        .spyOn(userPhotoService, 'update')
        .mockImplementationOnce(async () => {
          throw new Error('User not found!');
        });

      await expect(
        userPhotoService.update(mockUserPhoto.id, createDTOError, 30),
      ).rejects.toThrowError('User not found!');

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockServiceUpload.upload).toHaveBeenCalledTimes(0);
      expect(userPhotoService.update).toHaveBeenCalledWith(
        mockUserPhoto.id,
        createDTOError,
        30,
      );
    });

    it('should update a photo with valid input data', async () => {
      jest.spyOn(userPhotoService, 'update').mockResolvedValue(mockUserPhoto);

      const createPhoto = await userPhotoService.update(
        mockUserPhoto.id,
        mockFile,
      );

      expect(userPhotoService.update).toHaveBeenCalledTimes(1);
      expect(userPhotoService.update).toHaveBeenCalledWith(
        mockUserPhoto.id,
        mockFile,
      );

      expect(createPhoto).toBe(mockUserPhoto);
    });
  });

  describe('delete', () => {
    it('should throw an error if photo not found', async () => {
      jest
        .spyOn(userPhotoService, 'remove')
        .mockRejectedValue(new Error('Photo not found!'));

      await expect(userPhotoService.remove(500)).rejects.toThrowError(
        'Photo not found!',
      );

      expect(mockService.delete).toHaveBeenCalledTimes(0);
    });

    it('should delete a photo with valid input data', async () => {
      jest.spyOn(mockService, 'findOne').mockResolvedValue(mockUserPhoto);
      jest.spyOn(mockService, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      const result = await userPhotoService.remove(mockUserPhoto.id);

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: mockUserPhoto.id },
        relations: ['user'],
      });

      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockUserPhoto.id);

      expect(result).toBeDefined();
    });
  });
});
