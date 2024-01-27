import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '../strategies/auth.guard';

import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';

describe('AuthController unit tests', () => {
  let authController: AuthController;

  const mockService = {
    signIn: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        AuthGuard,
        { provide: AuthService, useValue: mockService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    const authDto = {
      email: 'jhonDoe@gmail.com',
      password: '909090',
    };
    it('should return a user object when a valid id is provided', async () => {
      await authController.signIn(authDto);

      expect(mockService.signIn).toHaveBeenCalledTimes(1);
      expect(mockService.signIn).toHaveBeenCalledWith(
        authDto.email,
        authDto.password,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile when authenticated', async () => {
      const user = {
        id: 1,
        user_name: 'John Doe',
        user_email: 'john@example.com',
      };

      const req = { user };

      const accessToken = 'mocked_access_token';
      jest
        .spyOn(mockService, 'signIn')
        .mockResolvedValue({ user, accessToken });

      const authDto = { email: 'john@example.com', password: 'password' };

      await authController.signIn(authDto);

      const result = await authController.getProfile(req as unknown as Request);

      expect(result).toEqual(user);
    });

    it('should return 401 unauthorized if not authenticated', async () => {
      const req = {};

      try {
        await authController.getProfile(req as Request);
      } catch (error) {
        expect(error.status).toBe(401);
      }
    });
  });
});
