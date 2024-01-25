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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DataBaseInterceptor } from '../../../http-exceptions/errors/interceptors/dataBase.interceptor';

import { BranchsService } from '../service/branchs.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { QuerysBranchDto } from '../dto/querys-branch.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Branch } from '../entities/branch.entity';

@ApiBearerAuth()
@ApiTags('branchs')
@Controller('branchs')
export class BranchsController {
  constructor(private readonly branchsService: BranchsService) {}

  @Get('paginate')
  async paginate(@Query() query: QuerysBranchDto): Promise<Pagination<Branch>> {
    return await this.branchsService.paginateBranch(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchsService.findOne(id);
  }

  @Get()
  findAll(@Query() querys: QuerysBranchDto) {
    return this.branchsService.findAll(querys);
  }

  @Post()
  @UseInterceptors(DataBaseInterceptor)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchsService.create(createBranchDto);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchsService.update(id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchsService.remove(id);
  }
}
