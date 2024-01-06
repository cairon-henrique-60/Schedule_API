import { User } from 'src/modules/users/entities/user.entity';

export class PayloadLogin {
  id: string;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.user_name;
    this.email = user.user_email;
  }
}
