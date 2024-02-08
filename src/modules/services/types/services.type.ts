export interface ICreateServiceData {
  service_name: string;
  service_value: number;
  expected_time: string;
  is_active: boolean;
  user_id: number;
}

export interface IUpdateServiceData {
  service_name?: string;
  service_value?: number;
  expected_time?: string;
  is_active?: boolean;
  user_id?: number;
}
