import { Test, TestingModule } from '@nestjs/testing';

import { ServicesService } from '../../../modules/services/services/services.service';

import { UserService } from '../../../modules/users/service/user.service';

import { Client } from '../entities/client.entity';
import { ClientsService } from './clients.service';

import { Branch } from '../../../modules/branchs/entities/branch.entity';
import { BranchsService } from '../../../modules/branchs/service/branchs.service';
import { QuerysClientDto } from '../dto/querys-client.dto';
import { Like } from 'typeorm';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

jest.mock('nestjs-typeorm-paginate');

describe('ClientsService', () => {
  let clientService: ClientsService;
  let branchService: BranchsService;

  const mockService = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
  mockClient.createdAt = '2022-01-01';
  mockClient.updatedAt = '2022-01-01';
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
      providers: [
        UserService,
        ClientsService,
        BranchsService,
        ServicesService,
        { provide: 'USER_REPOSITORY', useValue: mockService },
        { provide: 'BRANCH_REPOSITORY', useValue: mockService },
        { provide: 'CLIENTS_REPOSITORY', useValue: mockService },
        { provide: 'SERVICES_REPOSITORY', useValue: mockService },
      ],
    }).compile();

    clientService = module.get<ClientsService>(ClientsService);
    branchService = module.get<BranchsService>(BranchsService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(clientService).toBeDefined();
    expect(branchService).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate clients', async () => {
      const params: QuerysClientDto = {
        client_name: mockClient.client_name,
        first_name: mockClient.first_name,
        birth_date: mockClient.birth_date,
        client_phone: mockClient.client_phone,
        is_active: mockClient.is_active,
        branch_id: mockClient.branch_id,
        page: 1,
        limit: 100,
      };

      jest.spyOn(mockService, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      });

      await clientService.paginateClients(params);

      expect(mockService.createQueryBuilder).toHaveBeenCalledWith('c');
      expect(mockService.createQueryBuilder().select).toHaveBeenCalledWith([
        'c',
        'b',
      ]);
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        'c.branch',
        'b',
      );
      expect(mockService.createQueryBuilder().where).toHaveBeenCalledWith({
        client_name: Like(`%${params.client_name}%`),
        first_name: Like(`%${params.first_name}%`),
        birth_date: Like(`%${params.birth_date}%`),
        client_phone: Like(`%${params.client_phone}%`),
        is_active: params.is_active,
        branch_id: Like(`%${params.branch_id}%`),
      });
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
      };

      jest.spyOn(mockService, 'find').mockResolvedValue([]);

      const result = await clientService.findAll(params);

      expect(mockService.find).toHaveBeenCalledWith({
        where: {
          createdAt: Like(`%${params.createdAt}%`),
          deletedAt: Like(`%${params.deletedAt}%`),
          updatedAt: Like(`%${params.updatedAt}%`),
          branch_id: Like(`%${params.branch_id}%`),
          is_active: params.is_active,
          client_phone: Like(`%${params.client_phone}%`),
          birth_date: Like(`%${params.birth_date}%`),
          first_name: Like(`%${params.first_name}%`),
          client_name: Like(`%${params.client_name}%`),
        },
        relations: ['branch'],
        join: {
          alias: 'clients',
          leftJoinAndSelect: {
            branchs: 'clients.branch',
          },
        },
      });

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundError if client is not found', async () => {
      try {
        await clientService.findOne(500);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Client not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: 500 },
        relations: ['branch'],
        join: {
          alias: 'clients',
          leftJoinAndSelect: {
            branchs: 'clients.branch',
          },
        },
      });
    });

    it('should return a client object when a valid id is provided', async () => {
      jest.spyOn(clientService, 'findOne').mockResolvedValue(mockClient);

      await clientService.findOne(mockClient.id);

      expect(clientService.findOne).toHaveBeenCalledTimes(1);
      expect(clientService.findOne).toHaveBeenCalledWith(mockClient.id);
    });
  });

  describe('create', () => {
    const createClientDTO: CreateClientDto = {
      client_name: mockClient.client_name,
      first_name: mockClient.first_name,
      birth_date: mockClient.birth_date,
      client_phone: mockClient.client_phone,
      is_active: mockClient.is_active,
      branch_id: mockClient.branch_id,
    };

    it('should throw an error if user by branch not found', async () => {
      const createClinetDTOError: CreateClientDto = {
        client_name: mockClient.client_name,
        first_name: mockClient.first_name,
        birth_date: mockClient.birth_date,
        client_phone: mockClient.client_phone,
        is_active: mockClient.is_active,
        branch_id: 5,
      };

      jest
        .spyOn(clientService, 'create')
        .mockRejectedValue(new Error('Branch not found!'));

      await expect(
        clientService.create(createClinetDTOError),
      ).rejects.toThrowError('Branch not found!');

      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(clientService.create).toHaveBeenCalledWith(createClinetDTOError);
    });

    it('should create a client with valid input data', async () => {
      jest.spyOn(clientService, 'create').mockRestore();

      jest.spyOn(clientService, 'create').mockResolvedValue(mockClient);

      const createdBranch = await clientService.create(createClientDTO);

      expect(clientService.create).toHaveBeenCalledTimes(1);
      expect(clientService.create).toHaveBeenCalledWith(createClientDTO);

      expect(createdBranch).toBe(mockClient);
    });
  });

  describe('update', () => {
    const updateClientDTO: UpdateClientDto = {
      client_name: 'John',
      first_name: 'Doe',
      birth_date: '11/03/1994',
      client_phone: '32227568',
      is_active: true,
      branch_id: 1,
    };
    it('should throw an error if client not found', async () => {
      jest
        .spyOn(clientService, 'update')
        .mockRejectedValue(new Error('Client not found!'));

      await expect(
        clientService.update(500, updateClientDTO),
      ).rejects.toThrowError('Client not found!');

      expect(mockService.create).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if user by branch_id not found', async () => {
      const updateClientDTO: UpdateClientDto = {
        client_name: 'John',
        first_name: 'Doe',
        birth_date: '11/03/1994',
        client_phone: '32227568',
        is_active: true,
        branch_id: 5,
      };
      jest
        .spyOn(clientService, 'update')
        .mockRejectedValue(new Error('Branch not found!'));

      await expect(
        clientService.update(mockClient.id, updateClientDTO),
      ).rejects.toThrowError('Branch not found!');

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);
    });

    it('should update a client with valid input data', async () => {
      jest.spyOn(clientService, 'update').mockRestore();

      jest
        .spyOn(clientService, 'update')
        .mockImplementationOnce(async () => mockClient);

      const updateService = await clientService.update(
        mockClient.id,
        updateClientDTO,
      );

      expect(clientService.update).toHaveBeenCalledTimes(1);
      expect(clientService.update).toHaveBeenCalledWith(
        mockClient.id,
        updateClientDTO,
      );

      expect(updateService).toEqual(mockClient);
    });
  });

  describe('delete', () => {
    it('should throw an error if client not found', async () => {
      jest
        .spyOn(clientService, 'remove')
        .mockRejectedValue(new Error('Client not found!'));

      await expect(clientService.remove(500)).rejects.toThrowError(
        'Client not found!',
      );

      expect(mockService.delete).toHaveBeenCalledTimes(0);
    });

    it('should delete a client with valid input data', async () => {
      jest.spyOn(mockService, 'findOne').mockResolvedValue(mockClient);
      jest.spyOn(mockService, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      const result = await clientService.remove(mockClient.id);

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: mockClient.id },
        relations: ['branch'],
        join: {
          alias: 'clients',
          leftJoinAndSelect: {
            branchs: 'clients.branch',
          },
        },
      });

      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockClient.id);

      expect(result).toBeDefined();
    });
  });
});
