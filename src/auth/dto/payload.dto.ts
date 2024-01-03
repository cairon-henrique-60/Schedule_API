import { User } from 'src/modules/users/entities/user.entity';

export class PayloadLogin {
  id: number;
  
  constructor(user: User) {
    this.id = user.id;
  }
}
