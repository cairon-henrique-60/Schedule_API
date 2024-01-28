import { Inject, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

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
        'br',
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
      ])
      .leftJoin('b.user', 'u')
      .leftJoin('b.branchs', 'br')
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
      relations: ['user', 'services'],
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
      relations: ['user', 'services'],
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

    const createdBranch = this.branchsRepository.create({
      ...createBranchDto,
      services: await this.verifyServices(services),
    });

    const newBranch = await this.branchsRepository.save(createdBranch);

    return this.findOne(newBranch.id);
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    await this.findOne(id);

    const { services, ...rest } = updateBranchDto;

    if (updateBranchDto.user_id) {
      await this.userServive.findOne(+rest.user_id);
    }

    await this.branchsRepository.update(id, {
      ...rest,
      services: await this.verifyServices(services),
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.branchsRepository.delete(id);
  }

  private async verifyServices(services?: IService[]): Promise<Service[]> {
    console.log(services);
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

    console.log('Lista', servicesList);
    return servicesList;
  }
}
