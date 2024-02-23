import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { DataBaseInterceptor } from '../../../http-exceptions/errors/interceptors/dataBase.interceptor';

import { UserPhotoService } from '../service/user-photo.service';
import { QuerysUserPhotoDto } from '../dto/querys-user-photo.dto';
import { CreateUpdateUserPhotoDto } from '../dto/createOrUpdate-user-photo.dto';
import { UserPhoto } from '../entities/user-photo.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiBearerAuth()
@ApiTags('upload-photos-user')
@Controller('user-photo')
export class UserPhotoController {
  constructor(private readonly userPhotoService: UserPhotoService) {}

  @Get('paginate')
  async paginate(
    @Query() query: QuerysUserPhotoDto,
  ): Promise<Pagination<UserPhoto>> {
    return await this.userPhotoService.paginateUserPhoto(query);
  }

  @Get()
  findAll(@Query() querys: QuerysUserPhotoDto): Promise<UserPhoto[]> {
    return this.userPhotoService.findAll(querys);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserPhoto> {
    return this.userPhotoService.findOne(+id);
  }

  @Post()
  @UseInterceptors(DataBaseInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be sent',
    type: CreateUpdateUserPhotoDto,
  })
  @ApiQuery({
    name: 'userId',
    description: 'User ID',
    type: String,
    required: true,
  })
  create(
    @Query('userId') userId: string,
    @UploadedFile() createUserPhotoDto: CreateUpdateUserPhotoDto,
  ): Promise<UserPhoto> {
    return this.userPhotoService.create(+userId, createUserPhotoDto);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be sent',
    type: CreateUpdateUserPhotoDto,
  })
  @ApiQuery({
    name: 'userId',
    description: 'User ID',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: string,
    @UploadedFile()
    updateUserPhotoDto: CreateUpdateUserPhotoDto,
    @Param('userId') userId?: string,
  ): Promise<UserPhoto> {
    return this.userPhotoService.update(+id, updateUserPhotoDto, +userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.userPhotoService.remove(+id);
  }
}
