import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ClientsService } from '../services/clients.service';
import { Client } from '../entities/client.entity';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { QuerysClientDto } from '../dto/querys-client.dto';

import { DataBaseInterceptor } from '../../../http-exceptions/errors/interceptors/dataBase.interceptor';

@ApiBearerAuth()
@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('paginate')
  paginate(@Query() query: QuerysClientDto): Promise<Pagination<Client>> {
    return this.clientsService.paginateClients(query);
  }

  @Get()
  findAll(@Query() query: QuerysClientDto): Promise<Client[]> {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(+id);
  }

  @Post()
  @UseInterceptors(DataBaseInterceptor)
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.clientsService.remove(+id);
  }
}
