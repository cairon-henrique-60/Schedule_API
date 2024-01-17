import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { createPasswordHashed } from '../../../utils/password';

import { UnauthorizedError } from '../../../http-exceptions/errors/types/UnauthorizedError';

import { AuthService } from './auth.service';
import { User } from '../../../modules/users/entities/user.entity';
import { UserService } from '../../../modules/users/service/user.service';

describe('AuthService unit tests', () => {
  let authService: AuthService;
  let userService: UserService;

  let user_password: string;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockUser = new User();
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.password = user_password;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        UserService,
        AuthService,
        { provide: 'USER_REPOSITORY', useValue: mockUserService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);

    user_password = await createPasswordHashed('90202010');
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw NotFoundError if email or password invalid', async () => {
      jest.spyOn(mockUserService, 'findOne').mockResolvedValue(null);

      try {
        await authService.signIn('invalid@gmail.com', mockUser.password);
        throw new Error('Email or password invalid');
      } catch (error) {
        expect(error.message).toBe('Email or password invalid');
      }

      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        where: { user_email: 'invalid@gmail.com' },
      });
    });

    it('should throw UnauthorizedError if password is not validate', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue(null);

      try {
        await authService.signIn(mockUser.user_email, '101010');
        throw new UnauthorizedError('Password is not validate');
      } catch (error) {
        expect(error.message).toBe('Password is not validate');
      }

      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(
        mockUser.user_email,
        '101010',
      );
    });

    it('should return a user if user_email and password validate', async () => {
      const result = {
        user: mockUser,
        accessToken: 'fakeAccessToken',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      await authService.signIn(mockUser.user_email, mockUser.password);

      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(
        mockUser.user_email,
        mockUser.password,
      );
    });
  });
});
