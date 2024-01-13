import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { UserService } from '../service/user.service';
import { User } from '../entities/user.entity';
import { QueryUserDTO } from '../dto/querys-user.dto';
import { UserController } from '../controller/user.controller';

describe('UserController unit tests', () => {
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
  mockUser.updatedAt = new Date().toString();
  mockUser.deletedAt = new Date().toString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      await expect(userController.getById(mockUser.id)).resolves.toEqual(
        mockUser,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email when it exists in the database', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);

      await expect(
        userController.getByEmail(mockUser.user_email),
      ).resolves.toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no users match the query parameters', async () => {
      const result = [mockUser];
      const params: QueryUserDTO = {
        user_name: 'John',
        user_email: 'john@example.com',
        phone_number: '1234567890',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
      };

      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(userController.list(params)).resolves.toEqual(result);
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

      const createdUser = await userController.createUser(createUserDTO);

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

    it('should update user information when all input data is valid', async () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUser);

      await userController.updateUser(mockUser.id, updateUserDTO);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDTO,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user when a valid id is provided', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      await expect(userController.deleteUser(mockUser.id)).resolves.toBeDefined();
    });
  });
});
