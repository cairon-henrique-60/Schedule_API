import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';
import { UnauthorizedError } from '../../../http-exceptions/errors/types/UnauthorizedError';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { QueryUserDTO } from '../dto/querys-user.dto';
import { UserController } from '../controller/user.controller';
import { usersProviders } from '../provider/user.providers';

describe('UserService unit tests', () => {
  let userService: UserService;
  let userController: UserController;

  let user_password: string;

  const mockUser = new User();
  mockUser.id = randomUUID();
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';
  mockUser.createdAt = new Date().toString();
  mockUser.updatedAt = new Date().toString();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: 'USER_REPOSITORY', useClass: Repository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);

    user_password = '3245324622';
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user object when a valid id is provided', async () => {
      const result = mockUser;
      jest.spyOn(userService, 'findOne').mockResolvedValue(result);

      expect(await userController.getById(mockUser.id)).toBe(result);
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(async () => {
        await userController.getById('invalidId');
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email when it exists in the database', async () => {
      const result = { password: user_password, ...mockUser };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);

      expect(await userController.getByEmail(mockUser.user_email)).toBe(result);
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);

      expect(await userController.getByEmail('invalidId')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no users match the query parameters', async () => {
      const result = mockUser;
      const params: QueryUserDTO = {
        user_name: 'John',
        user_email: 'john@example.com',
        phone_number: '1234567890',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
      };

      jest.spyOn(userService, 'findAll').mockResolvedValue([mockUser]);

      expect(await userController.list(params)).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should create a user with valid input data and password', async () => {
      const result = mockUser;
      const createUserDTO = {
        user_name: 'John Doe',
        password: user_password,
        user_email: 'johndoe@example.com',
        phone_number: '1234567890',
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(result);

      expect(await userController.list(createUserDTO)).toBe(result);
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

    it('should update user information when all input data is valid', async () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUser);

      expect(
        await userController.updateUser(mockUser.id, updateUserDTO),
      ).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUser);

      await expect(
        userService.updateUser('invalidId', updateUserDTO),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw UnauthorizedError if current password is invalid', async () => {
      const updateUserDTO = {
        current_password: 'invalidPassword',
        user_name: 'New Name',
        user_email: 'newemail@example.com',
        password: 'newPassword',
        phone_number: '1234567890',
      };

      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUser);

      expect(
        await userService.updateUser(mockUser.id, updateUserDTO),
      ).rejects.toThrowError(UnauthorizedError);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user when a valid id is provided', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      expect(await userController.deleteUser('validId')).resolves.toBeDefined();
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.deleteUser('invalidId')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });
});
