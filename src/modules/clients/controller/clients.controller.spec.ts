import { Test, TestingModule } from '@nestjs/testing';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

import { Client } from '../entities/client.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from '../services/clients.service';

import { QuerysClientDto } from '../dto/querys-client.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

describe('ClientsController unit tests', () => {
  let clientController: ClientsController;

  const mockService = {
    paginateClients: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockClient = new Client();
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
  mockBranch.opening_hours = '08:00';
  mockBranch.closing_hours = '18:00';
  mockBranch.user_id = 1;
  mockBranch.district = 'Broklyn';
  mockBranch.local_number = '230B';
  mockBranch.complements = 'Main Street';

  mockClient.id = 1;
  mockClient.createdAt = '2024-01-30T11:24:40.000Z';
  mockClient.updatedAt = '2024-01-30T11:24:40.000Z';
  mockClient.deletedAt = null;
  mockClient.client_name = 'John';
  mockClient.first_name = 'Doe';
  mockClient.birth_date = '11/03/1994';
  mockClient.client_phone = '32227568';
  mockClient.is_active = true;
  mockClient.branch_id = mockBranch.id;
  mockClient.branch = mockBranch;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [{ provide: ClientsService, useValue: mockService }],
    }).compile();

    clientController = module.get<ClientsController>(ClientsController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(clientController).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate return an empty array when no clients', async () => {
      const params: QuerysClientDto = {
        client_name: mockClient.client_name,
        first_name: mockClient.first_name,
        birth_date: mockClient.birth_date,
        client_phone: mockClient.client_phone,
        is_active: mockClient.is_active,
        branch_id: mockClient.branch_id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await clientController.paginate(params);

      expect(mockService.paginateClients).toHaveBeenCalledTimes(1);
      expect(mockService.paginateClients).toHaveBeenCalledWith(params);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no clients match the query parameters', async () => {
      const params: QuerysClientDto = {
        client_name: mockClient.client_name,
        first_name: mockClient.first_name,
        birth_date: mockClient.birth_date,
        client_phone: mockClient.client_phone,
        is_active: mockClient.is_active,
        branch_id: mockClient.branch_id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await clientController.findAll(params);

      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(mockService.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a client object when a valid id is provided', async () => {
      await clientController.findOne(String(mockClient.id));

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith(mockClient.id);
    });
  });

  describe('create', () => {
    it('should create a client with valid input data', async () => {
      const createClientDto: CreateClientDto = {
        client_name: 'Cesar',
        first_name: 'Filho',
        birth_date: '11/03/1994',
        client_phone: '32227569',
        is_active: false,
        branch_id: 1,
      };

      await clientController.create(createClientDto);

      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(mockService.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('update', () => {
    const UpdateClientDto: UpdateClientDto = {
      client_name: 'John',
      first_name: 'Doe',
      birth_date: '11/03/1994',
      client_phone: '32227568',
      is_active: true,
      branch_id: 1,
    };

    it('should update clients information when all input data is valid', async () => {
      await clientController.update(String(mockClient.id), UpdateClientDto);

      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(mockService.update).toHaveBeenCalledWith(
        mockBranch.id,
        UpdateClientDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a branch when a valid id is provided', async () => {
      await clientController.remove(String(mockClient.id));

      expect(mockService.remove).toHaveBeenCalledTimes(1);
      expect(mockService.remove).toHaveBeenCalledWith(mockClient.id);
    });
  });
});
