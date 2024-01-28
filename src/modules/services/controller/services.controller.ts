import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DataBaseInterceptor } from '../../../http-exceptions/errors/interceptors/dataBase.interceptor';

import { ServicesService } from '../services/services.service';

import { Service } from '../entities/service.entity';

import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { QuerysServiceDto } from '../dto/querys-service.dto';

@ApiBearerAuth()
@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('paginate')
  paginate(@Query() query: QuerysServiceDto): Promise<Pagination<Service>> {
    return this.servicesService.paginateServices(query);
  }

  @Get()
  findAll(@Query() query: QuerysServiceDto): Promise<Service[]> {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Service> {
    return this.servicesService.findOne(+id);
  }

  @Post()
  @UseInterceptors(DataBaseInterceptor)
  create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(createServiceDto);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
