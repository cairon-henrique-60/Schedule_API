import { Test, TestingModule } from '@nestjs/testing';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

import { User } from '../../../modules/users/entities/user.entity';

import { Service } from '../entities/service.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from '../services/services.service';

import { QuerysServiceDto } from '../dto/querys-service.dto';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

describe('ServicesController unit tests', () => {
  let servicesController: ServicesController;

  const mockService = {
    paginateServices: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = new User();
  const mockBranch = new Branch();
  const mockServicesEntity = new Service();

  mockUser.id = 1;
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';

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
      controllers: [ServicesController],
      providers: [{ provide: ServicesService, useValue: mockService }],
    }).compile();

    servicesController = module.get<ServicesController>(ServicesController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(servicesController).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate return an empty array when no services', async () => {
      const params: QuerysServiceDto = {
        service_name: mockServicesEntity.service_name,
        service_value: mockServicesEntity.service_value,
        expected_time: mockServicesEntity.expected_time,
        is_active: mockServicesEntity.is_active,
        user_id: mockUser.id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await servicesController.paginate(params);

      expect(mockService.paginateServices).toHaveBeenCalledTimes(1);
      expect(mockService.paginateServices).toHaveBeenCalledWith(params);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no services match the query parameters', async () => {
      const params: QuerysServiceDto = {
        service_name: mockServicesEntity.service_name,
        service_value: mockServicesEntity.service_value,
        expected_time: mockServicesEntity.expected_time,
        is_active: mockServicesEntity.is_active,
        user_id: mockUser.id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await servicesController.findAll(params);

      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(mockService.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a branchs object when a valid id is provided', async () => {
      await servicesController.findOne(String(mockServicesEntity.id));

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith(mockServicesEntity.id);
    });
  });

  describe('create', () => {
    it('should create a service with valid input data', async () => {
      const createServiceDto: CreateServiceDto = {
        service_name: 'Degradê',
        service_value: 25,
        expected_time: '25:00',
        is_active: true,
        user_id: 1,
      };

      await servicesController.create(createServiceDto);

      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(mockService.create).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('update', () => {
    const updateServiceDto: UpdateServiceDto = {
      service_name: 'Degradê com desenho',
      service_value: 50,
      expected_time: '30:00',
      is_active: true,
      user_id: 1,
    };
    it('should update service information when all input data is valid', async () => {
      await servicesController.update(
        String(mockServicesEntity.id),
        updateServiceDto,
      );

      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(mockService.update).toHaveBeenCalledWith(
        mockServicesEntity.id,
        updateServiceDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a service when a valid id is provided', async () => {
      await servicesController.remove(String(mockServicesEntity.id));

      expect(mockService.remove).toHaveBeenCalledTimes(1);
      expect(mockService.remove).toHaveBeenCalledWith(mockServicesEntity.id);
    });
  });
});
