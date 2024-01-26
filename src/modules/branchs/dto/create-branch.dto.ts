import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const branchsSchema = z.object({
  branch_name: z.string(),
  cnpj: z.string().min(14).max(14).optional().nullable(),
  street: z.string(),
  cep: z.string().min(8).max(8),
  city: z.string(),
  district: z.string(),
  local_number: z.string().max(10),
  branch_phone: z.string().optional().nullable(),
  complements: z.string().max(100),
  user_id: z.string(),
});

export class CreateBranchDto extends createZodDto(branchsSchema) {
  /**
   * Name of the branch.
   * @example Brooklyn Cookies
   */
  branch_name: string;
  /**
   * CNPJ of the branch.
   * @example 12345678000200
   */
  cnpj: string;
  /**
   * Street of the branch.
   * @example R Alameda Islim
   */
  street: string;
  /**
   * CEP of the branch.
   * @example 36150000
   */
  cep: string;
  /**
   * City of the branch.
   * @example Rio de Janeiro
   */
  city: string;
  /**
   * District of the branch.
   * @example Bairro dos Caramelos
   */
  district: string;
  /**
   * Number residence of the branch.
   * @example 230B
   */
  local_number: string;
   /**
   * Number phone of the branch.
   * @example 32227460
   */
   branch_phone?: string;
  /**
   * Information additional of the branch.
   * @example Next to the bookstore
   */
  complements?: string;
  /**
   * Affiliate user id (owner).
   * @example ab#12342
   */
  user_id: string;
}
