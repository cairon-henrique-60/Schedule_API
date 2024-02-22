import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../utils/base.entity';

import { User } from '../../../modules/users/entities/user.entity';
import { ICreateUserPhoto, IUpdateUserPhoto } from '../types/user-photo.types';

@Entity('userPhoto')
export class UserPhoto extends Base {
  @Index()
  @Column('varchar')
  original_name: string;

  @Column('float')
  size: number;

  @Column('varchar')
  url: string;

  @Column('int')
  user_id: number;

  @OneToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  static create(data: ICreateUserPhoto) {
    const userPhotoItem = new UserPhoto();
    Object.assign(userPhotoItem, data);
    return userPhotoItem;
  }

  static update(data: IUpdateUserPhoto) {
    const userPhotoItem = new UserPhoto();
    Object.assign(userPhotoItem, data);
    return userPhotoItem;
  }
}
