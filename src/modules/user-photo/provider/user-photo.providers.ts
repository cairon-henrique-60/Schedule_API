import { DataSource } from 'typeorm';
import { UserPhoto } from '../entities/user-photo.entity';
export const userPhotoProviders = [
  {
    provide: 'USER_PHOTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserPhoto),
    inject: ['DATA_SOURCE'],
  },
];