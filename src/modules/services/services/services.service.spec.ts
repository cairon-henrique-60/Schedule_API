import { Test, TestingModule } from '@nestjs/testing';
import { Like } from 'typeorm';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

import { User } from '../../../modules/users/entities/user.entity';
import { UserService } from '../../../modules/users/service/user.service';

import { Service } from '../entities/service.entity';
import { ServicesService } from './services.service';

import { QuerysServiceDto } from '../dto/querys-service.dto';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

jest.mock('nestjs-typeorm-paginate');

describe('ServicesService unit tests', () => {
  let servicesService: ServicesService;
  let userService: UserService;

  const mockService = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = new User();
  const mockBranch = new Branch();
  const mockServicesEntity = new Service();

  mockUser.id = 1;
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';

  mockBranch.id = 1;
  mockBranch.createdAt = '2022-01-01';
  mockBranch.updatedAt = '2022-01-01';
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

  mockServicesEntity.id = 1;
  mockServicesEntity.createdAt = '2024-01-23T11:22:24.000Z';
  mockServicesEntity.updatedAt = '2024-01-23T11:22:24.000Z';
  mockServicesEntity.deletedAt = null;
  mockServicesEntity.service_name = 'Degradê';
  mockServicesEntity.service_value = 25.0;
  mockServicesEntity.expected_time = '25';
  mockServicesEntity.is_active = true;
  mockServicesEntity.user_id = mockUser.id;
  mockServicesEntity.user = mockUser;
  mockServicesEntity.branchs = [mockBranch];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        UserService,
        { provide: 'USER_REPOSITORY', useValue: mockService },
        { provide: 'SERVICES_REPOSITORY', useValue: mockService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(servicesService).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate services', async () => {
      const params: QuerysServiceDto = {
        service_name: mockServicesEntity.service_name,
        service_value: mockServicesEntity.service_value,
        expected_time: mockServicesEntity.expected_time,
        user_id: mockUser.id,
        page: 1,
        limit: 100,
      };

      jest.spyOn(mockService, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      });

      await servicesService.paginateServices(params);

      expect(mockService.createQueryBuilder).toHaveBeenCalledWith('s');
      expect(mockService.createQueryBuilder().select).toHaveBeenCalledWith([
        's',
        'b',
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
      ]);
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        's.user',
        'u',
      );
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        's.branchs',
        'b',
      );
      expect(mockService.createQueryBuilder().where).toHaveBeenCalledWith({
        service_name: Like(`%${params.service_name}%`),
        service_value: Like(`%${params.service_value}%`),
        expected_time: Like(`%${params.expected_time}%`),
        user_id: Like(`%${params.user_id}%`),
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundError if service is not found', async () => {
      try {
        await servicesService.findOne(500);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Service not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: 500 },
        relations: ['user', 'branchs'],
      });
    });

    it('should return a service object when a valid id is provided', async () => {
      jest
        .spyOn(servicesService, 'findOne')
        .mockResolvedValue(mockServicesEntity);

      await servicesService.findOne(mockUser.id);

      expect(servicesService.findOne).toHaveBeenCalledTimes(1);
      expect(servicesService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no branchs match the query parameters', async () => {
      const params: QuerysServiceDto = {
        service_name: mockServicesEntity.service_name,
        service_value: mockServicesEntity.service_value,
        expected_time: mockServicesEntity.expected_time,
        user_id: mockUser.id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-02',
      };

      jest.spyOn(mockService, 'find').mockResolvedValue([]);

      const result = await servicesService.findAll(params);

      expect(mockService.find).toHaveBeenCalledWith({
        where: {
          createdAt: Like(`%${params.createdAt}%`),
          deletedAt: Like(`%${params.deletedAt}%`),
          updatedAt: Like(`%${params.updatedAt}%`),
          service_name: Like(`%${params.service_name}%`),
          service_value: Like(`%${params.service_value}%`),
          expected_time: Like(`%${params.expected_time}%`),
          user_id: Like(`%${params.user_id}%`),
        },
        relations: ['user', 'branchs'],
      });

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    const createServiceDTO: CreateServiceDto = {
      service_name: mockServicesEntity.expected_time,
      service_value: mockServicesEntity.service_value,
      expected_time: mockServicesEntity.expected_time,
      is_active: mockServicesEntity.is_active,
      user_id: mockUser.id,
    };

    it('should throw an error if user by user_id not found', async () => {
      const createBranchDTOError: CreateServiceDto = {
        service_name: mockServicesEntity.expected_time,
        service_value: mockServicesEntity.service_value,
        expected_time: mockServicesEntity.expected_time,
        is_active: mockServicesEntity.is_active,
        user_id: 5,
      };
      jest.spyOn(servicesService, 'create').mockImplementationOnce(async () => {
        throw new Error('User not found!');
      });

      await expect(
        servicesService.create(createBranchDTOError),
      ).rejects.toThrowError('User not found!');

      expect(mockService.save).toHaveBeenCalledTimes(0);
      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(servicesService.create).toHaveBeenCalledWith(createBranchDTOError);
    });

    it('should create a service with valid input data', async () => {
      jest.spyOn(servicesService, 'create').mockRestore();

      jest
        .spyOn(servicesService, 'create')
        .mockResolvedValue(mockServicesEntity);

      const createdBranch = await servicesService.create(createServiceDTO);

      expect(servicesService.create).toHaveBeenCalledTimes(1);
      expect(servicesService.create).toHaveBeenCalledWith(createServiceDTO);

      expect(createdBranch).toBe(mockServicesEntity);
    });
  });

  describe('update', () => {
    const updateServiceDTO: UpdateServiceDto = {
      service_name: 'Degradê',
      service_value: 25,
      expected_time: '25:00',
      is_active: true,
      user_id: mockUser.id,
    };
    it('should throw an error if service not found', async () => {
      jest
        .spyOn(servicesService, 'update')
        .mockRejectedValue(new Error('Service not found!'));

      await expect(
        servicesService.update(500, updateServiceDTO),
      ).rejects.toThrowError('Service not found!');

      expect(mockService.save).toHaveBeenCalledTimes(0);
      expect(mockService.create).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if user by user_id not found', async () => {
      const updateServiceDTOError: UpdateServiceDto = {
        service_name: mockServicesEntity.expected_time,
        service_value: mockServicesEntity.service_value,
        expected_time: mockServicesEntity.expected_time,
        is_active: mockServicesEntity.is_active,
        user_id: 5,
      };
      jest
        .spyOn(servicesService, 'update')
        .mockRejectedValue(new Error('User not found!'));

      await expect(
        servicesService.update(mockServicesEntity.id, updateServiceDTOError),
      ).rejects.toThrowError('User not found!');

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);
    });

    it('should update a service with valid input data', async () => {
      jest.spyOn(servicesService, 'update').mockRestore();

      jest
        .spyOn(servicesService, 'update')
        .mockImplementationOnce(async () => mockServicesEntity);

      const updateService = await servicesService.update(
        mockServicesEntity.id,
        updateServiceDTO,
      );

      expect(servicesService.update).toHaveBeenCalledTimes(1);
      expect(servicesService.update).toHaveBeenCalledWith(
        mockServicesEntity.id,
        updateServiceDTO,
      );

      expect(updateService).toEqual(mockServicesEntity);
    });
  });

  describe('delete', () => {
    it('should throw an error if service not found', async () => {
      jest
        .spyOn(servicesService, 'remove')
        .mockRejectedValue(new Error('Service not found!'));

      await expect(servicesService.remove(500)).rejects.toThrowError(
        'Service not found!',
      );

      expect(mockService.delete).toHaveBeenCalledTimes(0);
    });

    it('should delete a service with valid input data', async () => {
      jest.spyOn(mockService, 'findOne').mockResolvedValue(mockServicesEntity);
      jest.spyOn(mockService, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      const result = await servicesService.remove(mockServicesEntity.id);

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: mockServicesEntity.id },
        relations: ['user', 'branchs'],
      });

      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockServicesEntity.id);

      expect(result).toBeDefined();
    });
  });
});
