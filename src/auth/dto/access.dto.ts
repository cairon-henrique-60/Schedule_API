import { User } from 'src/modules/users/entities/user.entity';

export interface AccessDTO {
  user: User;
  accessToken: string;
}
