import { Test, TestingModule } from '@nestjs/testing';
import { Like } from 'typeorm';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';
import { BadRequestError } from '../../../http-exceptions/errors/types/BadRequestError';
import { UnauthorizedError } from '../../../http-exceptions/errors/types/UnauthorizedError';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { QueryUserDTO } from '../dto/querys-user.dto';

jest.mock('nestjs-typeorm-paginate');

describe('UserService unit tests', () => {
  let userService: UserService;

  let user_password: string;

  const mockService = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = new User();
  const mockBranch = new Branch();

  mockBranch.id = 1;
  mockBranch.createdAt = '2024-01-23T11:22:24.000Z';
  mockBranch.updatedAt = '2024-01-23T11:22:24.000Z';
  mockBranch.deletedAt = null;
  mockBranch.branch_name = 'Barber';
  mockBranch.cnpj = '12345678000200';
  mockBranch.street = 'Rua Alameda';
  mockBranch.cep = '36150000';
  mockBranch.city = 'New York';
  mockBranch.user_id = mockUser.id;
  mockBranch.district = 'Broklyn';
  mockBranch.local_number = '230B';
  mockBranch.branch_phone = '32227460';
  mockBranch.complements = 'Main Street';
  mockBranch.user = mockUser;

  mockUser.id = 1;
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';
  mockUser.createdAt = new Date().toString();
  mockUser.updatedAt = new Date().toString();
  mockUser.branchs = [mockBranch];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'USER_REPOSITORY', useValue: mockService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    user_password = '3245324622';
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('paginateUser', () => {
    it('should paginate users', async () => {
      const mockParams: QueryUserDTO = {
        user_name: mockUser.user_name,
        user_email: mockUser.user_email,
        phone_number: mockUser.phone_number,
        page: 1,
        limit: 10,
      };

      jest.spyOn(mockService, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      });

      await userService.paginateUser(mockParams);

      expect(mockService.createQueryBuilder).toHaveBeenCalledWith('u');
      expect(mockService.createQueryBuilder().select).toHaveBeenCalledWith([
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
        'u.createdAt',
        'u.updatedAt',
        'u.deletedAt',
      ]);
      expect(
        mockService.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalledWith('u.branchs', 'branch');
      expect(mockService.createQueryBuilder().where).toHaveBeenCalledWith({
        user_name: Like(`%${mockParams.user_name}%`),
        user_email: Like(`%${mockParams.user_email}%`),
        phone_number: Like(`%${mockParams.phone_number}%`),
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundError if user is not found', async () => {
      try {
        await userService.findOne(500);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('User not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: 500 },
        select: [
          'id',
          'user_name',
          'user_email',
          'phone_number',
          'createdAt',
          'updatedAt',
        ],
        relations: ['branchs'],
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            branchs: 'user.branchs',
          },
        },
      });
    });

    it('should return a user object when a valid id is provided', async () => {
      const result = mockUser;
      jest.spyOn(userService, 'findOne').mockResolvedValue(result);

      await userService.findOne(mockUser.id);

      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOneByEmail', () => {
    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      try {
        await userService.findOneByEmail('invalid@gmail.com');
        throw new Error('User not found!');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('User not found!');
      }

      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'invalid@gmail.com',
      );
    });

    it('should return a user object when a valid id is provided', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.user_name = 'John Doe';
      mockUser.user_email = 'john@example.com';
      mockUser.phone_number = '1234567890';
      mockUser.createdAt = '2022-01-01T00:00:00.000Z';
      mockUser.updatedAt = '2022-01-01T00:00:00.000Z';
      mockUser.deletedAt = null;

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);

      await userService.findOneByEmail(mockUser.user_email);

      expect(userService.findOneByEmail).toHaveBeenCalled();
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        mockUser.user_email,
      );
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no users match the query parameters', async () => {
      const params: QueryUserDTO = {
        user_name: 'John',
        user_email: 'john@example.com',
        phone_number: '1234567890',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
      };

      jest.spyOn(mockService, 'find').mockResolvedValue([]);

      const result = await userService.findAll(params);

      expect(mockService.find).toHaveBeenCalledWith({
        select: [
          'id',
          'user_name',
          'user_email',
          'phone_number',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
        where: {
          createdAt: Like(`%${params.createdAt}%`),
          deletedAt: Like(`%${params.deletedAt}%`),
          phone_number: Like(`%${params.phone_number}%`),
          updatedAt: Like(`%${params.updatedAt}%`),
          user_email: Like(`%${params.user_email}%`),
          user_name: Like(`%${params.user_name}%`),
        },
        relations: ['branchs'],
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            branchs: 'user.branchs',
          },
        },
      });

      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    const result = mockUser;
    const createUserDTO = {
      user_name: 'John Doe',
      password: user_password,
      user_email: 'johndoe@example.com',
      phone_number: '1234567890',
    };

    it('should throw an error if email already exists', async () => {
      jest.spyOn(userService, 'createUser').mockImplementationOnce(async () => {
        throw new Error('Email already exists');
      });

      await expect(userService.createUser(createUserDTO)).rejects.toThrowError(
        'Email already exists',
      );

      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(userService.createUser).toHaveBeenCalledTimes(1);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDTO);
    });

    it('should throw an error if phone number already exists', async () => {
      jest.spyOn(userService, 'createUser').mockImplementationOnce(async () => {
        throw new Error('Phone number already exists');
      });

      await expect(userService.createUser(createUserDTO)).rejects.toThrowError(
        'Phone number already exists',
      );

      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(userService.createUser).toHaveBeenCalledTimes(1);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDTO);
    });

    it('should create a user with valid input data and password', async () => {
      jest.spyOn(userService, 'createUser').mockRestore();

      jest.spyOn(userService, 'createUser').mockResolvedValue(result);

      const createdUser = await userService.createUser(createUserDTO);

      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDTO);

      expect(createdUser).toBe(result);
    });
  });

  describe('updateUser', () => {
    const updateUserDTO = {
      current_password: user_password,
      user_name: 'New Name',
      user_email: 'newemail@example.com',
      password: '3245324622',
      phone_number: '1234567890',
    };

    it('should throw NotFoundError if user is not found', async () => {
      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new NotFoundError('User not found!'));

      await expect(
        userService.updateUser(500, updateUserDTO),
      ).rejects.toThrowError(NotFoundError);

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);

      expect(userService.updateUser).toHaveBeenCalledWith(500, updateUserDTO);
    });

    it('should throw BadRequestError if is not password is valid and current_password undefined', async () => {
      const updateUserDTOErro = {
        user_name: 'New Name',
        user_email: 'newemail@example.com',
        password: '3245324622',
        phone_number: '1234567890',
      };

      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(
          new BadRequestError(
            'Both current_password and password are required!',
          ),
        );

      await expect(
        userService.updateUser(mockUser.id, updateUserDTOErro),
      ).rejects.toThrowError(BadRequestError);

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDTOErro,
      );
    });

    it('should throw BadRequestError if is not password undefined and current_password is valid', async () => {
      const updateUserDTOErro = {
        user_name: 'New Name',
        user_email: 'newemail@example.com',
        current_password: user_password,
        phone_number: '1234567890',
      };

      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(
          new BadRequestError(
            'Both current_password and password are required!',
          ),
        );

      await expect(
        userService.updateUser(mockUser.id, updateUserDTOErro),
      ).rejects.toThrowError(BadRequestError);

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDTOErro,
      );
    });

    it('should throw UnauthorizedError if current password is invalid', async () => {
      const invalidPasswordDTO = {
        current_password: 'invalidPassword',
        user_name: 'New Name',
        user_email: 'newemail@example.com',
        password: 'newPassword',
        phone_number: '1234567890',
      };

      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new UnauthorizedError('Password is not valid!'));

      await expect(
        userService.updateUser(mockUser.id, invalidPasswordDTO),
      ).rejects.toThrowError(UnauthorizedError);

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        invalidPasswordDTO,
      );
    });

    it('should update user information when all input data is valid', async () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUser);

      const updatedUser = await userService.updateUser(
        mockUser.id,
        updateUserDTO,
      );

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDTO,
      );

      expect(updatedUser).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(mockService, 'findOne').mockResolvedValue(null);

      try {
        await userService.deleteUser(500);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe('User not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        select: [
          'id',
          'user_name',
          'user_email',
          'phone_number',
          'createdAt',
          'updatedAt',
        ],
        where: { id: 500 },
        relations: ['branchs'],
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            branchs: 'user.branchs',
          },
        },
      });

      expect(mockService.delete).not.toHaveBeenCalled();
    });

    it('should delete a user when a valid id is provided', async () => {
      jest.spyOn(mockService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockService, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      const result = await userService.deleteUser(mockUser.id);

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        select: [
          'id',
          'user_name',
          'user_email',
          'phone_number',
          'createdAt',
          'updatedAt',
        ],
        where: { id: mockUser.id },
        relations: ['branchs'],
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            branchs: 'user.branchs',
          },
        },
      });

      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockUser.id);

      expect(result).toBeDefined();
    });
  });
});
