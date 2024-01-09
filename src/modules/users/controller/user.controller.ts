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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/modules/auth/decorator/auth.decorator';
import { DataBaseInterceptor } from 'src/http-exceptions/errors/interceptors/dataBase.interceptor';

import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { QueryUserDTO } from '../dto/querys-user.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('findUserByEmail/:email')
  getByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Get()
  list(@Query() query: QueryUserDTO) {
    return this.userService.findAll(query);
  }
  @Public()
  @Post()
  @UseInterceptors(DataBaseInterceptor)
  createUser(@Body() data: CreateUserDTO) {
    return this.userService.createUser(data);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
