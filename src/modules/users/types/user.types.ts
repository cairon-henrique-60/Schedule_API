export interface ICreateUserData {
  user_name: string;
  password: string;
  user_email: string;
  phone_number?: string;
}

export interface IUpdateUserData {
  user_name?: string;
  password?: string;
  current_password?: string;
  user_email?: string;
  phone_number?: string;
}
