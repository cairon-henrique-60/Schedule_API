import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Public } from 'src/auth/decorator/auth.decorator';

import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('findUserByEmail/:email')
  getByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Get()
  list(
    @Query('user_name') user_name: string,
    @Query('user_email') user_email: string,
    @Query('phone_number') phone_number: string | null,
    @Query('createdAt') createdAt: string,
    @Query('updatedAt') updatedAt: string,
    @Query('deletedAt') deletedAt: string,
  ) {
    return this.userService.findAll({
      user_name: user_name,
      user_email: user_email,
      phone_number: phone_number,
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: deletedAt,
    });
  }
  @Public()
  @Post()
  createUser(@Body() data: CreateUserDTO) {
    return this.userService.createUser(data);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    return this.userService.updateUser(+id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
