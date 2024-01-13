import { Test, TestingModule } from '@nestjs/testing';
import { Like, Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { createPasswordHashed } from '../../../utils/password';
import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';
import { UnauthorizedError } from '../../../http-exceptions/errors/types/UnauthorizedError';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { QueryUserDTO } from '../dto/querys-user.dto';

describe('UserService unit tests', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUser = new User();
  mockUser.id = randomUUID();
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';
  mockUser.createdAt = new Date().toString();
  mockUser.updatedAt = new Date().toString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>('USER_REPOSITORY');

    id: randomUUID();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user object when a valid id is provided', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      const result = await userService.findOne('validId');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'validId' },
        select: [
          'id',
          'user_name',
          'user_email',
          'phone_number',
          'createdAt',
          'updatedAt',
        ],
      });
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.findOne('invalidId')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email when it exists in the database', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await userService.findOneByEmail(mockUser.user_email);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { user_email: mockUser.user_email },
      });
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        userService.findOneByEmail('nonexistent@gmail.com'),
      ).rejects.toThrowError(NotFoundError);
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

      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      const result = await userService.findAll(params);

      expect(result).toEqual([]);
      expect(userRepository.find).toHaveBeenCalledWith({
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
          user_name: Like(`%${params.user_name}%`),
          user_email: Like(`%${params.user_email}%`),
          phone_number: Like(`%${params.phone_number}%`),
          createdAt: Like(`%${params.createdAt}%`),
          updatedAt: Like(`%${params.updatedAt}%`),
          deletedAt: Like(`%${params.deletedAt}%`),
        },
      });
    });
  });

  describe('createUser', () => {
    it('should create a user with valid input data and password', async () => {
      const createUserDTO = {
        user_name: 'John Doe',
        password: await createPasswordHashed('password123'),
        user_email: 'johndoe@example.com',
        phone_number: '1234567890',
      };

      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue({ ...createUserDTO, id: mockUser.id } as User);

      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const newUser = await userService.createUser(createUserDTO);

      expect(newUser).toBeDefined();
      expect(newUser.id).toEqual(
        expect.stringMatching(/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i),
      );
      expect(newUser.user_name).toBe(createUserDTO.user_name);
      expect(newUser.user_email).toBe(createUserDTO.user_email);
      expect(newUser.phone_number).toBe(createUserDTO.phone_number);
      expect(newUser.createdAt).toBeDefined();

      expect(userRepository.create).toHaveBeenCalledWith(mockUser);

      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserDTO,
      });
    });
  });

  describe('updateUser', () => {
    const id = 'validId';
    const updateUserDTO = {
      current_password: 'validPassword',
      user_name: 'New Name',
      user_email: 'newemail@example.com',
      password: 'newPassword',
      phone_number: '1234567890',
    };

    it('should update user information when all input data is valid', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        ...mockUser,
        ...updateUserDTO,
      } as unknown as User);

      expect(userService.findOne).toHaveBeenCalledWith(id);
      await expect(
        userService.updateUser(id, updateUserDTO),
      ).resolves.toBeDefined();

      expect(userService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        userService.updateUser('invalidId', updateUserDTO),
      ).rejects.toThrowError(UnauthorizedError);
    });

    it('should throw UnauthorizedError if current password is invalid', async () => {
      const id = 'validId';
      const updateUserDTO = {
        current_password: 'invalidPassword',
        user_name: 'New Name',
        user_email: 'newemail@example.com',
        password: 'newPassword',
        phone_number: '1234567890',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      await expect(
        userService.updateUser(id, updateUserDTO),
      ).rejects.toThrowError(UnauthorizedError);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user when a valid id is provided', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      await expect(userService.deleteUser('validId')).resolves.toBeDefined();
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.deleteUser('invalidId')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });
});
