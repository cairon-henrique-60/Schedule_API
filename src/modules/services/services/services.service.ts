import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository } from 'typeorm';

import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { User } from '../../../modules/users/entities/user.entity';
import { UserService } from '../../../modules/users/service/user.service';

import { Service } from '../entities/service.entity';

import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { QuerysServiceDto } from '../dto/querys-service.dto';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';
import { ICreateServiceData, IUpdateServiceData } from '../types/services.type';

@Injectable()
export class ServicesService {
  constructor(
    @Inject('SERVICES_REPOSITORY')
    private readonly serviceRepository: Repository<Service>,
    private readonly userService: UserService,
  ) {}

  async paginateServices(
    params: QuerysServiceDto,
  ): Promise<Pagination<Service>> {
    const { limit, page, ...rest } = params;

    const options: IPaginationOptions = {
      limit,
      page,
    };

    const whereClause = this.buildWhereClause(rest);

    const queryBuilder = this.serviceRepository.createQueryBuilder('s');
    queryBuilder
      .select([
        's',
        'b',
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.phone_number',
      ])
      .leftJoin('s.user', 'u')
      .leftJoin('s.branchs', 'b')
      .where(whereClause);

    return paginate<Service>(queryBuilder, options);
  }

  async findAll(params: QuerysServiceDto): Promise<Service[]> {
    const whereClause = this.buildWhereClause(params);

    const services = await this.serviceRepository.find({
      where: whereClause,
      relations: ['user', 'branchs'],
      join: {
        alias: 'services',
        leftJoinAndSelect: {
          branchs: 'services.branchs',
        },
      },
    });

    const mappedServices = services.map((service) =>
      this.mapServiceResponse(service),
    );

    return mappedServices;
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['user', 'branchs'],
      join: {
        alias: 'services',
        leftJoinAndSelect: {
          branchs: 'services.branchs',
        },
      },
    });

    if (!service) {
      throw new NotFoundError('Service not found!');
    }
    const response = this.mapServiceResponse(service);

    return response;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    await this.userService.findOne(createServiceDto.user_id);

    const serviceItem: ICreateServiceData = {
      ...createServiceDto,
    };

    const newService = Service.create(serviceItem);

    const createdService = await this.serviceRepository.save(newService);

    return this.findOne(createdService.id);
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    await this.findOne(id);

    if (updateServiceDto.user_id) {
      await this.userService.findOne(updateServiceDto.user_id);
    }

    const serviceItem: IUpdateServiceData = {
      ...updateServiceDto,
    };

    const newService = Service.update(serviceItem);

    await this.serviceRepository.update(id, newService);

    return this.findOne(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.serviceRepository.delete(id);
  }

  private buildWhereClause(params: QuerysServiceDto): object {
    const { is_active, ...rest } = params;
    const whereClause = {};

    Object.keys(rest).forEach((key) => {
      if (rest[key]) {
        whereClause[key] = Like(`%${rest[key]}%`);
      }
    });

    if (is_active !== undefined) {
      whereClause['is_active'] = is_active.toString() === 'true' ? 1 : 0;
    }

    return whereClause;
  }

  private mapServiceResponse(service: Service): Service {
    const { user, branchs, ...restService } = service;

    const response = {
      ...restService,
      branchs,
      user: this.mapUserResponse(user),
    };

    return response as Service;
  }

  private mapUserResponse(user: User): User {
    const response = {
      id: user.id,
      user_name: user.user_name,
      user_email: user.user_email,
      phone_number: user.phone_number,
    };
    return response as User;
  }
}
