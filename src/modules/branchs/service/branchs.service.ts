import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository } from 'typeorm';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { UserService } from '../../../modules/users/service/user.service';
import { ServicesService } from '../../../modules/services/services/services.service';

import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { QuerysBranchDto } from '../dto/querys-branch.dto';

import { Branch } from '../entities/branch.entity';
import { Service } from '../../../modules/services/entities/service.entity';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';

import { ICreateBranchData, IUpdateBranchData } from '../types/branch.types';

interface IService {
  id: number;
}

@Injectable()
export class BranchsService {
  constructor(
    @Inject('BRANCH_REPOSITORY')
    private readonly branchsRepository: Repository<Branch>,
    private readonly userServive: UserService,
    private readonly servicesService: ServicesService,
  ) {}

  async paginateBranch(params: QuerysBranchDto): Promise<Pagination<Branch>> {
    const whereClause: QuerysBranchDto = {};

    const { limit, page, ...rest } = params;

    const options: IPaginationOptions = {
      limit,
      page,
    };

    Object.keys(rest).forEach((key) => {
      if (rest[key]) {
        whereClause[key] = Like(`%${rest[key]}%`);
      }
    });

    const queryBuilder = this.branchsRepository.createQueryBuilder('b');
    queryBuilder
      .select([
        'b',
        's',
        'c',
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
      ])
      .leftJoin('b.user', 'u')
      .leftJoin('b.services', 's')
      .leftJoin('b.clients', 'c')
      .where(whereClause);

    return paginate<Branch>(queryBuilder, options);
  }

  async findAll(params: QuerysBranchDto): Promise<Branch[]> {
    const whereClause: QuerysBranchDto = {};

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        whereClause[key] = Like(`%${params[key]}%`);
      }
    });

    const branchs = await this.branchsRepository.find({
      where: whereClause,
      relations: ['user', 'services', 'clients'],
    });

    const response = branchs.map(({ user, ...restBranch }) => ({
      ...restBranch,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        phone_number: user.phone_number,
      },
    }));

    return response as Branch[];
  }

  async findOne(id: number): Promise<Branch> {
    const branch = await this.branchsRepository.findOne({
      where: { id },
      relations: ['user', 'services', 'clients'],
    });
    if (!branch) {
      throw new NotFoundError('Branch not found!');
    }

    const { user, ...restBranch } = branch;

    return {
      ...restBranch,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        phone_number: user.phone_number,
      },
    } as Branch;
  }

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    await this.userServive.findOne(+createBranchDto.user_id);

    const { services } = createBranchDto;

    const createdBranch: ICreateBranchData = {
      branch_name: createBranchDto.branch_name,
      cnpj: createBranchDto.branch_phone,
      street: createBranchDto.street,
      cep: createBranchDto.cep,
      city: createBranchDto.city,
      user_id: createBranchDto.user_id,
      district: createBranchDto.district,
      local_number: createBranchDto.local_number,
      branch_phone: createBranchDto.branch_name,
      complements: createBranchDto.complements,
      opening_hours: createBranchDto.opening_hours,
      closing_hours: createBranchDto.closing_hours,
      services: await this.verifyServices(services),
    };

    const branch = Branch.create(createdBranch);

    const newBranch = await this.branchsRepository.save(branch);

    return this.findOne(newBranch.id);
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const existingBranch = await this.findOne(id);

    if (updateBranchDto.user_id) {
      await this.userServive.findOne(+updateBranchDto.user_id);
    }

    const { services, ...rest } = updateBranchDto;

    const updatedBranchData: IUpdateBranchData = {
      ...existingBranch,
      ...rest,
      opening_hours: updateBranchDto.opening_hours,
      closing_hours: updateBranchDto.closing_hours,
      services: services && (await this.verifyServices(services)),
    };

    const updatedBranch = Branch.update(updatedBranchData);

    await this.branchsRepository.save(updatedBranch);

    return this.findOne(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);

    return this.branchsRepository.delete(id);
  }

  private async verifyServices(services?: IService[]): Promise<Service[]> {
    if (!services || services.length === 0) {
      return [];
    }

    const servicesList = await Promise.all(
      services.map(async (service) => {
        const foundService = await this.servicesService.findOne(service.id);
        if (!foundService) {
          throw new NotFoundError(`Service with ID ${service.id} not found.`);
        }
        return foundService;
      }),
    );

    return servicesList;
  }
}
