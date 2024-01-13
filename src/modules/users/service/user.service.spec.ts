import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { createPasswordHashed } from 'src/utils/password';
import { NotFoundError } from 'src/http-exceptions/errors/types/NotFoundError';
import { UnauthorizedError } from 'src/http-exceptions/errors/types/UnauthorizedError';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const emptyUser: User = {
    user_name: '',
    password: '',
    user_email: '',
    phone_number: '',
    id: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    updateCreateDate: function (): void {
      throw new Error('Function not implemented.');
    },
    updateUpdateDate: function (): void {
      throw new Error('Function not implemented.');
    },
    updateDeleteDate: function (): void {
      throw new Error('Function not implemented.');
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(User);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const sampleUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(emptyUser);

      const result = await userService.findOne('1');
      expect(result).toEqual(sampleUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(emptyUser);

      await expect(userService.findOne('1')).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by EMAIL', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(emptyUser);
      const sampleUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(emptyUser);

      const result = await userService.findOneByEmail('levis@gmail.com');
      expect(result).toEqual(sampleUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(emptyUser);

      await expect(
        userService.findOneByEmail('levis@gmail.com'),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('findAll', async () => {
    jest.spyOn(userRepository, 'find').mockImplementationOnce(undefined);

    await expect(userService.findAll({})).rejects.toThrowError(NotFoundError);
  });

  describe('createUser', async () => {
    jest.spyOn(userRepository, 'create').mockImplementationOnce(undefined);

    await expect(
      userService.createUser({
        user_name: 'string',
        password: '909090',
        user_email: 'levis@gmail.com',
        phone_number: '997203320',
      }),
    ).rejects.toThrowError(NotFoundError);
  });

  describe('updateUser', () => {
    // Test updateUser method
  });

  describe('deleteUser', () => {
    // Test deleteUser method
  });
});
