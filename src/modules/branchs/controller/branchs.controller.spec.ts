import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../../modules/users/entities/user.entity';

import { Branch } from '../entities/branch.entity';
import { BranchsController } from './branchs.controller';
import { BranchsService } from '../service/branchs.service';

import { QuerysBranchDto } from '../dto/querys-branch.dto';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';

describe('BranchsController unit tests', () => {
  let branchController: BranchsController;

  const mockService = {
    paginateBranch: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = new User();
  const mockBranch = new Branch();

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
  mockBranch.complements = 'Main Street';
  mockBranch.user = mockUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchsController],
      providers: [{ provide: BranchsService, useValue: mockService }],
    }).compile();

    branchController = module.get<BranchsController>(BranchsController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(branchController).toBeDefined();
  });

  describe('paginate', () => {
    it('should paginate return an empty array when no branchs', async () => {
      const params: QuerysBranchDto = {
        branch_name: mockBranch.branch_name,
        cnpj: mockBranch.cnpj,
        street: mockBranch.street,
        cep: mockBranch.cep,
        city: mockBranch.city,
        district: mockBranch.district,
        local_number: mockBranch.local_number,
        complements: mockBranch.complements,
        user_id: mockUser.id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
        page: 1,
        limit: 100,
      };

      await branchController.paginate(params);

      expect(mockService.paginateBranch).toHaveBeenCalledTimes(1);
      expect(mockService.paginateBranch).toHaveBeenCalledWith(params);
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
        complements: mockBranch.complements,
        user_id: mockUser.id,
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        deletedAt: '2022-01-03',
      };

      await branchController.findAll(params);

      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(mockService.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a branchs object when a valid id is provided', async () => {
      await branchController.findOne(String(mockBranch.id));

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith(mockBranch.id);
    });
  });

  describe('create', () => {
    it('should create a branch with valid input data', async () => {
      const createBranchDTO: CreateBranchDto = {
        branch_name: 'Poli Shop',
        cnpj: '12345678000300',
        street: 'Rua San Francisco',
        cep: '36150000',
        city: 'New York',
        district: 'Broklyn',
        local_number: '230B',
        complements: 'Ao lado de uma casa',
        user_id: 1,
      };

      await branchController.create(createBranchDTO);

      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(mockService.create).toHaveBeenCalledWith(createBranchDTO);
    });
  });

  describe('update', () => {
    const updateBranchDTO: UpdateBranchDto = {
      branch_name: 'Poli Shop',
      cnpj: '12345678000300',
      street: 'Rua San Francisco',
      cep: '36150000',
      city: 'New York',
      district: 'Broklyn',
      local_number: '230B',
      complements: 'Ao lado de uma casa',
      user_id: 1,
    };
    it('should update service information when all input data is valid', async () => {
      await branchController.update(String(mockBranch.id), updateBranchDTO);

      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(mockService.update).toHaveBeenCalledWith(
        mockBranch.id,
        updateBranchDTO,
      );
    });
  });

  describe('delete', () => {
    it('should delete a branch when a valid id is provided', async () => {
      await branchController.remove(String(mockBranch.id));

      expect(mockService.remove).toHaveBeenCalledTimes(1);
      expect(mockService.remove).toHaveBeenCalledWith(mockBranch.id);
    });
  });
});
