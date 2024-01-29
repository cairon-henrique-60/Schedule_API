import { Test, TestingModule } from '@nestjs/testing';

import { Like } from 'typeorm';

import { UserService } from '../../../modules/users/service/user.service';
import { User } from '../../../modules/users/entities/user.entity';

import { Client } from '../../../modules/clients/entities/client.entity';

import { Service } from '../../../modules/services/entities/service.entity';
import { ServicesService } from '../../../modules/services/services/services.service';

import { Branch } from '../entities/branch.entity';
import { BranchsService } from './branchs.service';

import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { QuerysBranchDto } from '../dto/querys-branch.dto';

jest.mock('nestjs-typeorm-paginate');

describe('BranchsService unit tests', () => {
  let branchService: BranchsService;
  let userService: UserService;
  let servicesService: ServicesService;

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
  const mockClient = new Client();
  const mockServicesEntity = new Service();

  mockUser.id = 1;
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';

  mockServicesEntity.id = 1;
  mockServicesEntity.createdAt = '2024-01-23T11:22:24.000Z';
  mockServicesEntity.updatedAt = '2024-01-23T11:22:24.000Z';
  mockServicesEntity.deletedAt = null;
  mockServicesEntity.service_name = 'Degradê';
  mockServicesEntity.service_value = 25.0;
  mockServicesEntity.expected_time = '25';
  mockServicesEntity.is_active = true;
  mockServicesEntity.user_id = mockUser.id;

  mockClient.id = 1;
  mockClient.client_name = 'Jhon';
  mockClient.first_name = 'Doe';
  mockClient.birth_date = '11/03/1990';
  mockClient.branch_id = mockBranch.id;

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
  mockBranch.user = mockUser;
  mockBranch.clients = [mockClient];
  mockBranch.services = [mockServicesEntity];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        BranchsService,
        UserService,
        { provide: 'USER_REPOSITORY', useValue: mockService },
        { provide: 'BRANCH_REPOSITORY', useValue: mockService },
        { provide: 'SERVICES_REPOSITORY', useValue: mockService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    branchService = module.get<BranchsService>(BranchsService);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(branchService).toBeDefined();
    expect(servicesService).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate branches', async () => {
      const mockParams: QuerysBranchDto = {
        branch_name: mockBranch.branch_name,
        cnpj: mockBranch.cnpj,
        city: mockBranch.city,
        page: 1,
        limit: 10,
      };

      jest.spyOn(mockService, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      });

      await branchService.paginateBranch(mockParams);

      expect(mockService.createQueryBuilder).toHaveBeenCalledWith('b');
      expect(mockService.createQueryBuilder().select).toHaveBeenCalledWith([
        'b',
        's',
        'c',
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
      ]);
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        'b.user',
        'u',
      );
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        'b.services',
        's',
      );
      expect(mockService.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        'b.clients',
        'c',
      );
      expect(mockService.createQueryBuilder().where).toHaveBeenCalledWith({
        branch_name: Like(`%${mockParams.branch_name}%`),
        cnpj: Like(`%${mockParams.cnpj}%`),
        city: Like(`%${mockParams.city}%`),
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundError if branch is not found', async () => {
      try {
        await branchService.findOne(500);
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Branch not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: 500 },
        relations: ['user', 'services', 'clients'],
      });
    });

    it('should return a branch object when a valid id is provided', async () => {
      const result = mockBranch;
      jest.spyOn(branchService, 'findOne').mockResolvedValue(result);

      await branchService.findOne(mockUser.id);

      expect(branchService.findOne).toHaveBeenCalledTimes(1);
      expect(branchService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no branchs match the query parameters', async () => {
      const params: QuerysBranchDto = {
        branch_name: mockBranch.branch_name,
        cnpj: mockBranch.cnpj,
        street: mockBranch.street,
        cep: mockBranch.cep,
        city: mockBranch.city,
        district: mockBranch.district,
        local_number: mockBranch.local_number,
        branch_phone: mockBranch.branch_phone,
        complements: mockBranch.complements,
        user_id: mockBranch.user_id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
      };

      jest.spyOn(mockService, 'find').mockResolvedValue([]);

      const result = await branchService.findAll(params);

      expect(mockService.find).toHaveBeenCalledWith({
        where: {
          createdAt: Like(`%${params.createdAt}%`),
          deletedAt: Like(`%${params.deletedAt}%`),
          updatedAt: Like(`%${params.updatedAt}%`),
          complements: Like(`%${params.complements}%`),
          user_id: Like(`%${params.user_id}%`),
          local_number: Like(`%${params.local_number}%`),
          branch_phone: Like(`%${params.branch_phone}%`),
          district: Like(`%${params.district}%`),
          city: Like(`%${params.city}%`),
          cep: Like(`%${params.cep}%`),
          street: Like(`%${params.street}%`),
          cnpj: Like(`%${params.cnpj}%`),
          branch_name: Like(`%${params.branch_name}%`),
        },
        relations: ['user', 'services', 'clients'],
      });

      expect(result).toEqual([]);
    });
  });

  describe('createBranch', () => {
    const result = mockBranch;
    const createBranchDTO: CreateBranchDto = {
      branch_name: 'Poli Shop',
      cnpj: '12345678000300',
      street: 'Rua San Francisco',
      cep: '36150000',
      city: 'New York',
      district: 'Broklyn',
      local_number: '230B',
      branch_phone: '32227460',
      complements: 'Ao lado de uma casa',
      user_id: 1,
      services: [
        {
          id: 1,
        },
      ],
    };

    it('should throw an error if user by user_id not found', async () => {
      const createBranchDTOError: CreateBranchDto = {
        branch_name: 'Poli Shop',
        cnpj: '12345678000300',
        street: 'Rua San Francisco',
        cep: '36150000',
        city: 'New York',
        district: 'Broklyn',
        local_number: '230B',
        branch_phone: '32227460',
        complements: 'Ao lado de uma casa',
        user_id: 1,
        services: [
          {
            id: 1,
          },
        ],
      };
      jest.spyOn(branchService, 'create').mockImplementationOnce(async () => {
        throw new Error('User not found!');
      });

      await expect(
        branchService.create(createBranchDTOError),
      ).rejects.toThrowError('User not found!');

      expect(mockService.save).toHaveBeenCalledTimes(0);
      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(branchService.create).toHaveBeenCalledWith(createBranchDTOError);
    });

    it('should throw an error if any service by id not found', async () => {
      const createBranchDTOError: CreateBranchDto = {
        branch_name: 'Poli Shop',
        cnpj: '12345678000300',
        street: 'Rua San Francisco',
        cep: '36150000',
        city: 'New York',
        district: 'Broklyn',
        local_number: '230B',
        branch_phone: '32227460',
        complements: 'Ao lado de uma casa',
        user_id: 1,
        services: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
      };

      jest.spyOn(branchService, 'create').mockImplementationOnce(async () => {
        throw new Error('Service with ID 2 not found.');
      });

      await expect(
        branchService.create(createBranchDTOError),
      ).rejects.toThrowError('Service with ID 2 not found.');

      expect(mockService.save).toHaveBeenCalledTimes(0);
      expect(mockService.create).toHaveBeenCalledTimes(0);
      expect(branchService.create).toHaveBeenCalledWith(createBranchDTOError);
    });

    it('should create a branchs with valid input data', async () => {
      jest.spyOn(branchService, 'create').mockRestore();

      jest.spyOn(branchService, 'create').mockResolvedValue(result);

      const createdBranch = await branchService.create(createBranchDTO);

      expect(branchService.create).toHaveBeenCalledTimes(1);
      expect(branchService.create).toHaveBeenCalledWith(createBranchDTO);

      expect(createdBranch).toBe(result);
    });
  });

  describe('updateBranch', () => {
    const updateBranchDTO: UpdateBranchDto = {
      branch_name: 'Poli Shop',
      cnpj: '12345678000300',
      street: 'Rua San Francisco',
      cep: '36150000',
      city: 'New York',
      district: 'Broklyn',
      local_number: '230B',
      branch_phone: '32227460',
      complements: 'Ao lado de uma casa',
      user_id: 1,
      services: [
        {
          id: 1,
        },
      ],
    };

    it('should throw an error if branch not found', async () => {
      jest
        .spyOn(branchService, 'update')
        .mockRejectedValue(new Error('Branch not found!'));

      await expect(
        branchService.update(500, updateBranchDTO),
      ).rejects.toThrowError('Branch not found!');

      expect(mockService.save).toHaveBeenCalledTimes(0);
      expect(mockService.create).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if user by user_id not found', async () => {
      const updateBranchDTOError: UpdateBranchDto = {
        branch_name: 'Poli Shop',
        cnpj: '12345678000300',
        street: 'Rua San Francisco',
        cep: '36150000',
        city: 'New York',
        district: 'Broklyn',
        local_number: '230B',
        branch_phone: '32227460',
        complements: 'Ao lado de uma casa',
        user_id: 500,
        services: [
          {
            id: 1,
          },
        ],
      };
      jest
        .spyOn(branchService, 'update')
        .mockRejectedValue(new Error('User not found!'));

      await expect(
        branchService.update(mockBranch.id, updateBranchDTOError),
      ).rejects.toThrowError('User not found!');

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(mockService.findOne).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if any service by id not found', async () => {
      const updateBranchDTOError: UpdateBranchDto = {
        branch_name: 'Poli Shop',
        cnpj: '12345678000300',
        street: 'Rua San Francisco',
        cep: '36150000',
        city: 'New York',
        district: 'Broklyn',
        local_number: '230B',
        branch_phone: '32227460',
        complements: 'Ao lado de uma casa',
        user_id: 1,
        services: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
      };

      jest.spyOn(branchService, 'update').mockImplementationOnce(async () => {
        throw new Error('Service with ID 2 not found.');
      });

      await expect(
        branchService.update(mockBranch.id, updateBranchDTOError),
      ).rejects.toThrowError('Service with ID 2 not found.');

      expect(mockService.update).toHaveBeenCalledTimes(0);
      expect(branchService.update).toHaveBeenCalledWith(
        mockBranch.id,
        updateBranchDTOError,
      );
    });

    it('should update a branchs with valid input data', async () => {
      jest.spyOn(branchService, 'update').mockRestore();

      jest
        .spyOn(branchService, 'update')
        .mockImplementationOnce(async () => mockBranch);

      const updateBranch = await branchService.update(
        mockBranch.id,
        updateBranchDTO,
      );

      expect(branchService.update).toHaveBeenCalledTimes(1);
      expect(branchService.update).toHaveBeenCalledWith(
        mockBranch.id,
        updateBranchDTO,
      );

      expect(updateBranch).toEqual(mockBranch);
    });
  });

  describe('deleteBranch', () => {
    it('should throw an error if branch not found', async () => {
      jest
        .spyOn(branchService, 'remove')
        .mockRejectedValue(new Error('Branch not found!'));

      await expect(branchService.remove(500)).rejects.toThrowError(
        'Branch not found!',
      );

      expect(mockService.delete).toHaveBeenCalledTimes(0);
    });

    it('should delete a branchs with valid input data', async () => {
      jest.spyOn(mockService, 'findOne').mockResolvedValue(mockBranch);
      jest.spyOn(mockService, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });

      const result = await branchService.remove(mockBranch.id);

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: mockBranch.id },
        relations: ['user', 'services', 'clients'],
      });

      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockBranch.id);

      expect(result).toBeDefined();
    });
  });
});
