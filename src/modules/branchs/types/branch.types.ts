import { Service } from '../../../modules/services/entities/service.entity';

export interface ICreateBranchData {
  branch_name: string;
  cnpj: string;
  street: string;
  cep: string;
  city: string;
  user_id: number;
  district: string;
  local_number: string;
  branch_phone: string;
  complements: string;
  opening_hours: string;
  closing_hours: string;
  services?: Service[];
}

export interface IUpdateBranchData {
  branch_name?: string;
  cnpj?: string;
  street?: string;
  cep?: string;
  city?: string;
  user_id?: number;
  district?: string;
  local_number?: string;
  branch_phone?: string;
  complements?: string;
  opening_hours?: string;
  closing_hours?: string;
  services?: Service[];
}
