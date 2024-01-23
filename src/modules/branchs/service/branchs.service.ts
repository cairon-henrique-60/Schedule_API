import { Inject, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

import { UserService } from '../../../modules/users/service/user.service';

import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { QuerysBranchDto } from '../dto/querys-branch.dto';

import { Branch } from '../entities/branch.entity';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';

@Injectable()
export class BranchsService {
  public get branchsReposotoy(): Repository<Branch> {
    return this._branchsReposotoy;
  }
  constructor(
    @Inject('BRANCH_REPOSITORY')
    private readonly _branchsReposotoy: Repository<Branch>,
    private readonly userServive: UserService,
  ) {}

  async findAll(params: QuerysBranchDto): Promise<Branch[]> {
    const whereClause: QuerysBranchDto = {};

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        whereClause[key] = Like(`%${params[key]}%`);
      }
    });
    return this.branchsReposotoy.find({
      where: whereClause,
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchsReposotoy.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!branch) {
      throw new NotFoundError('Branch not found!');
    }
    return branch;
  }

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    await this.userServive.findOne(createBranchDto.user_id);

    const createdBranch = this.branchsReposotoy.create(createBranchDto);

    const newBranch = await this.branchsReposotoy.save(createdBranch);

    return newBranch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    await this.findOne(id);

    if (updateBranchDto.user_id) {
      await this.userServive.findOne(updateBranchDto.user_id);
    }

    await this.branchsReposotoy.update(id, updateBranchDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.branchsReposotoy.delete(id);
  }
}
