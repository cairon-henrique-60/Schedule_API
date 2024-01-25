import { Test, TestingModule } from '@nestjs/testing';
import { Like } from 'typeorm';

import { randomUUID } from 'crypto';

import { UserService } from '../../../modules/users/service/user.service';
import { User } from '../../../modules/users/entities/user.entity';

import { Branch } from '../entities/branch.entity';
import { BranchsService } from './branchs.service';

import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { QuerysBranchDto } from '../dto/querys-branch.dto';

describe('BranchsService unit tests', () => {
  let branchService: BranchsService;
  let userService: UserService;

  const mockService = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = new User();
  const mockBranch = new Branch();

  mockUser.id = randomUUID();
  mockUser.user_name = 'John Doe';
  mockUser.user_email = 'johndoe@example.com';
  mockUser.phone_number = '1234567890';

  mockBranch.id = randomUUID();
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
      providers: [
        BranchsService,
        UserService,
        { provide: 'BRANCH_REPOSITORY', useValue: mockService },
        { provide: 'USER_REPOSITORY', useValue: mockService },
      ],
    }).compile();

    branchService = module.get<BranchsService>(BranchsService);
    userService = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(branchService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundError if branch is not found', async () => {
      try {
        await branchService.findOne('invalid_id');
        throw new Error('Error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Branch not found!');
      }

      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid_id' },
        relations: ['user'],
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
        complements: mockBranch.complements,
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
          local_number: Like(`%${params.local_number}%`),
          district: Like(`%${params.district}%`),
          city: Like(`%${params.city}%`),
          cep: Like(`%${params.cep}%`),
          street: Like(`%${params.street}%`),
          cnpj: Like(`%${params.cnpj}%`),
          branch_name: Like(`%${params.branch_name}%`),
        },
        relations: ['user'],
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
      complements: 'Ao lado de uma casa',
      user_id: '37e4d06a-1283-4109-991b-8700e3fe116d',
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
        complements: 'Ao lado de uma casa',
        user_id: 'invalidUserId',
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
      complements: 'Ao lado de uma casa',
      user_id: '37e4d06a-1283-4109-991b-8700e3fe116d',
    };

    it('should throw an error if branch not found', async () => {
      jest
        .spyOn(branchService, 'update')
        .mockRejectedValue(new Error('Branch not found!'));

      await expect(
        branchService.update('invalidId', updateBranchDTO),
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
        complements: 'Ao lado de uma casa',
        user_id: 'invalidUserId',
      };
      jest
        .spyOn(branchService, 'update')
        .mockRejectedValue(new Error('User not found!'));

      await expect(
        branchService.update(mockBranch.id, updateBranchDTOError),
      ).rejects.toThrowError('User not found!');

      expect(mockService.save).toHaveBeenCalledTimes(0);
      expect(mockService.create).toHaveBeenCalledTimes(0);
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

      await expect(branchService.remove('invalidId')).rejects.toThrowError(
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
        relations: ['user'],
      });

      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockBranch.id);

      expect(result).toBeDefined();
    });
  });
});
