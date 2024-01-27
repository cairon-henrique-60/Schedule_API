import { Inject, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

import { BranchsService } from '../../../modules/branchs/service/branchs.service';

import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { QuerysServiceDto } from '../dto/querys-service.dto';

import { Service } from '../entities/service.entity';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';

@Injectable()
export class ServicesService {
  constructor(
    @Inject('SERVICES_REPOSITORY')
    private readonly serviceRepository: Repository<Service>,
    private readonly branchService: BranchsService,
  ) {}

  async findAll(params: QuerysServiceDto): Promise<Service[]> {
    const whereClause = {};

    const { is_active, ...rest } = params;

    Object.keys(rest).forEach((key) => {
      if (rest[key]) {
        whereClause[key] = Like(`%${rest[key]}%`);
      }
    });

    if (is_active !== undefined) {
      whereClause['is_active'] =
        typeof is_active === 'boolean' ? is_active.toString() : is_active;
    }

    const services = await this.serviceRepository.find({
      where: whereClause,
      relations: ['branchs'],
    });

    return services;
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['branchs'],
    });

    if (!service) {
      throw new NotFoundError('Service not found!');
    }
    return service;
  }

  async create(createServiceDto: CreateServiceDto) {
    const { branchs, ...rest } = createServiceDto;

    const service = this.serviceRepository.create(
      branchs && branchs.length > 0
        ? {
            ...rest,
            branchs: await Promise.all(
              branchs.map((b) => this.branchService.findOne(b.id)),
            ),
          }
        : {
            ...rest,
          },
    );

    const createdService = await this.serviceRepository.save(service);

    return this.findOne(createdService.id);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const { branchs, ...rest } = updateServiceDto;

    const service = this.serviceRepository.create(
      branchs && branchs.length > 0
        ? {
            ...rest,
            branchs: await Promise.all(
              branchs.map((b) => this.branchService.findOne(b.id)),
            ),
          }
        : {
            ...rest,
          },
    );

    await this.serviceRepository.update(id, service);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.serviceRepository.delete(id);
  }
}
