export interface ICreateUserPhoto {
  original_name: string;
  size: number;
  url: string;
  user_id: number;
}

export interface IUpdateUserPhoto {
  original_name?: string;
  size?: number;
  url?: string;
  user_id?: number;
}
