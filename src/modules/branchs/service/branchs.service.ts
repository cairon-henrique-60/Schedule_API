import { Inject, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { UserService } from '../../../modules/users/service/user.service';

import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { QuerysBranchDto } from '../dto/querys-branch.dto';

import { Branch } from '../entities/branch.entity';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';

@Injectable()
export class BranchsService {
  public get branchsRepository(): Repository<Branch> {
    return this._branchsReposotoy;
  }
  constructor(
    @Inject('BRANCH_REPOSITORY')
    private readonly _branchsReposotoy: Repository<Branch>,
    private readonly userServive: UserService,
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
      .select(['b', 'u.id', 'u.user_name', 'u.user_email', 'u.phone_number'])
      .leftJoin('b.user', 'u')
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
      relations: ['user'],
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

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchsRepository.findOne({
      where: { id },
      relations: ['user'],
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
    await this.userServive.findOne(createBranchDto.user_id);

    const createdBranch = this.branchsRepository.create(createBranchDto);

    const newBranch = await this.branchsRepository.save(createdBranch);

    return this.findOne(newBranch.id);
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    await this.findOne(id);

    if (updateBranchDto.user_id) {
      await this.userServive.findOne(updateBranchDto.user_id);
    }

    await this.branchsRepository.update(id, updateBranchDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.branchsRepository.delete(id);
  }
}
