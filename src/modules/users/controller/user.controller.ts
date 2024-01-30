import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../modules/auth/decorator/auth.decorator';
import { DataBaseInterceptor } from '../../../http-exceptions/errors/interceptors/dataBase.interceptor';

import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { QueryUserDTO } from '../dto/querys-user.dto';

import { User } from '../entities/user.entity';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('paginate')
  async paginate(@Query() query: QueryUserDTO): Promise<Pagination<User>> {
    return await this.userService.paginateUser(query);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Get('findUserByEmail/:email')
  getByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Get()
  list(@Query() query: QueryUserDTO): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @Public()
  @Post()
  @UseInterceptors(DataBaseInterceptor)
  createUser(@Body() data: CreateUserDTO): Promise<User> {
    return this.userService.createUser(data);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDTO,
  ): Promise<User> {
    return this.userService.updateUser(+id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.deleteUser(+id);
  }
}
