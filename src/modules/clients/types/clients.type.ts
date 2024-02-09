export interface ICreateClientData {
  client_name: string;
  first_name: string;
  birth_date: string;
  client_phone: string;
  is_active: boolean;
  branch_id: number;
}

export interface IUpdateClientData {
  client_name?: string;
  first_name?: string;
  birth_date?: string;
  client_phone?: string;
  is_active?: boolean;
  branch_id?: number;
}
