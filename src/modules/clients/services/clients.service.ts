import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { BranchsService } from '../../../modules/branchs/service/branchs.service';

import { Client } from '../entities/client.entity';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { QuerysClientDto } from '../dto/querys-client.dto';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';

@Injectable()
export class ClientsService {
  constructor(
    @Inject('CLIENTS_REPOSITORY')
    private readonly clientRepository: Repository<Client>,
    private readonly branchsService: BranchsService,
  ) {}

  async paginateClients(params: QuerysClientDto): Promise<Pagination<Client>> {
    const { limit, page, ...rest } = params;

    const options: IPaginationOptions = {
      limit,
      page,
    };

    const whereClause = this.buildWhereClause(rest);

    const queryBuilder = this.clientRepository.createQueryBuilder('c');
    queryBuilder
      .select(['c', 'b'])
      .leftJoin('c.branchs', 'b')
      .where(whereClause);

    return paginate<Client>(queryBuilder, options);
  }

  async findAll(params: QuerysClientDto): Promise<Client[]> {
    const whereClause = this.buildWhereClause(params);

    return await this.clientRepository.find({
      where: whereClause,
      relations: ['branchs'],
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['branchs'],
    });

    if (!client) {
      throw new NotFoundError('Client not found!');
    }

    return client;
  }

  async create(createClientDto: CreateClientDto) {
    await this.branchsService.findOne(createClientDto.branch_id);

    const client = this.clientRepository.create(createClientDto);

    const createClient = await this.clientRepository.save(client);

    return this.findOne(createClient.id);
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    if (updateClientDto.branch_id) {
      this.branchsService.findOne(updateClientDto.branch_id);
    }

    await this.clientRepository.update(id, updateClientDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);

    return this.clientRepository.delete(id);
  }

  private buildWhereClause(params: QuerysClientDto): object {
    const { is_active, ...rest } = params;
    const whereClause = {};

    Object.keys(rest).forEach((key) => {
      if (rest[key]) {
        whereClause[key] = Like(`%${rest[key]}%`);
      }
    });

    if (is_active !== undefined) {
      whereClause['is_active'] = is_active;
    }

    return whereClause;
  }
}