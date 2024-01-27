import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';
import { QueryUserDTO } from '../dto/querys-user.dto';
import { UserController } from '../controller/user.controller';

describe('UserController unit tests', () => {
  let userController: UserController;

  let user_password: string;

  const mockService = {
    paginateUser: jest.fn(),
    findOne: jest.fn(),
    findOneByEmail: jest.fn(),
    findAll: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';
  mockUser.createdAt = new Date().toString();
  mockUser.updatedAt = new Date().toString();
  mockUser.updatedAt = new Date().toString();
  mockUser.deletedAt = new Date().toString();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }],
    }).compile();

    userController = module.get<UserController>(UserController);

    user_password = '3245324622';
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user object when a valid id is provided', async () => {
      await userController.getById(String(mockUser.id));

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email when it exists in the database', async () => {
      await userController.getByEmail(mockUser.user_email);

      expect(mockService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(mockService.findOneByEmail).toHaveBeenCalledWith(
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

      await userController.list(params);

      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(mockService.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('paginateUser', () => {
    it('should return an empty array when no users match the query parameters by paginate', async () => {
      const params: QueryUserDTO = {
        user_name: 'John',
        user_email: 'john@example.com',
        phone_number: '1234567890',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        limit: 100,
        page: 1,
      };

      await userController.paginate(params);

      expect(mockService.paginateUser).toHaveBeenCalledTimes(1);
      expect(mockService.paginateUser).toHaveBeenCalledWith(params);
    });
  });

  describe('createUser', () => {
    it('should create a user with valid input data and password', async () => {
      const createUserDTO = {
        user_name: 'John Doe',
        password: user_password,
        user_email: 'johndoe@example.com',
        phone_number: '1234567890',
      };

      await userController.createUser(createUserDTO);

      expect(mockService.createUser).toHaveBeenCalledTimes(1);
      expect(mockService.createUser).toHaveBeenCalledWith(createUserDTO);
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
      await userController.updateUser(String(mockUser.id), updateUserDTO);

      expect(mockService.updateUser).toHaveBeenCalledTimes(1);
      expect(mockService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDTO,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user when a valid id is provided', async () => {
      await userController.deleteUser(String(mockUser.id));

      expect(mockService.deleteUser).toHaveBeenCalledTimes(1);
      expect(mockService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
