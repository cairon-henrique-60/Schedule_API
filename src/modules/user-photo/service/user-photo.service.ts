import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository } from 'typeorm';

import { UserService } from '../../../modules/users/service/user.service';
import { UploadPhotoService } from '../../../modules/upload/upload-photo/service/upload-photo.service';

import { CreateUpdateUserPhotoDto } from '../dto/createOrUpdate-user-photo.dto';
import { QuerysUserPhotoDto } from '../dto/querys-user-photo.dto';

import { UserPhoto } from '../entities/user-photo.entity';

import { NotFoundError } from '../../../http-exceptions/errors/types/NotFoundError';
import { ICreateUserPhoto, IUpdateUserPhoto } from '../types/user-photo.types';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserPhotoService {
  constructor(
    @Inject('USER_PHOTO_REPOSITORY')
    private readonly userPhotoRepository: Repository<UserPhoto>,
    private readonly uploadPhotoService: UploadPhotoService,
    private readonly userService: UserService,
  ) {}

  async paginateUserPhoto(
    params: QuerysUserPhotoDto,
  ): Promise<Pagination<UserPhoto>> {
    const whereClause: QuerysUserPhotoDto = {};

    const { limit, page, ...rest } = params;

    const options: IPaginationOptions = {
      limit,
      page,
    };

    Object.keys(rest).forEach((key) => {
      if (rest[key]) {
        whereClause[key] = Like(`%${rest[key]}%`);
      }
    });

    const queryBuilder = this.userPhotoRepository.createQueryBuilder('p');
    queryBuilder
      .select(['p', 'u.id', 'u.user_name', 'u.user_email', 'u.phone_number'])
      .leftJoin('p.user', 'u')
      .where(whereClause);

    return paginate<UserPhoto>(queryBuilder, options);
  }

  async findAll(params: QuerysUserPhotoDto): Promise<UserPhoto[]> {
    const whereClauses: QuerysUserPhotoDto = {};

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        whereClauses[key] = Like(`%${params[key]}%`);
      }
    });

    const photos = await this.userPhotoRepository.find({
      where: whereClauses,
      relations: ['user'],
    });

    const response = photos.map(({ user, ...rest }) => ({
      ...rest,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        phone_number: user.phone_number,
      },
    }));

    return response as UserPhoto[];
  }

  async findOne(id: number): Promise<UserPhoto> {
    const photo = await this.userPhotoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!photo) {
      throw new NotFoundError('Photo not found!');
    }

    const { user, ...rest } = photo;

    return {
      ...rest,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        phone_number: user.phone_number,
      },
    } as UserPhoto;
  }

  async create(
    userId: number,
    createUserPhotoDto: CreateUpdateUserPhotoDto,
  ): Promise<UserPhoto> {
    await this.userService.findOne(userId);

    const photo = await this.uploadPhotoService.upload(createUserPhotoDto);

    const photoData: ICreateUserPhoto = {
      original_name: createUserPhotoDto.originalname,
      size: createUserPhotoDto.size,
      url: photo.signedUrl,
      user_id: userId,
    };

    const photoUser = UserPhoto.create(photoData);

    const newPhoto = await this.userPhotoRepository.save(photoUser);

    return this.findOne(newPhoto.id);
  }

  async update(
    id: number,
    updateUserPhotoDto: CreateUpdateUserPhotoDto,
    userId?: number,
  ) {
    await this.findOne(id);

    if (userId) {
      await this.userService.findOne(userId);
    }

    const photo = await this.uploadPhotoService.upload(updateUserPhotoDto);

    const photoData: IUpdateUserPhoto = {
      original_name: updateUserPhotoDto.originalname,
      size: updateUserPhotoDto.size,
      url: photo.signedUrl,
    };

    const newPhoto = UserPhoto.update(photoData);

    await this.userPhotoRepository.update(id, newPhoto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);

    return this.userPhotoRepository.delete(id);
  }
}
