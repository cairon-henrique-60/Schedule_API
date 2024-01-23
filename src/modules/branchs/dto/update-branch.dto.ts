import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const branchsSchema = z.object({
  branch_name: z.string().optional(),
  cnpj: z.string().min(14).max(14).optional().nullable(),
  street: z.string().optional(),
  cep: z.string().min(8).max(8).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  local_number: z.string().max(10).optional(),
  complements: z.string().max(100).optional(),
  user_id: z.string().optional(),
});

export class UpdateBranchDto extends createZodDto(branchsSchema) {
  /**
   * Name of the branch.
   * @example Brooklyn Cookies
   */
  branch_name?: string;
  /**
   * CNPJ of the branch.
   * @example 12345678000200
   */
  cnpj?: string;
  /**
   * Street of the branch.
   * @example R Alameda Islim
   */
  street?: string;
  /**
   * CEP of the branch.
   * @example 36150000
   */
  cep?: string;
  /**
   * City of the branch.
   * @example Rio de Janeiro
   */
  city?: string;
  /**
   * District of the branch.
   * @example Bairro dos Caramelos
   */
  district?: string;
  /**
   * Number residence of the branch.
   * @example 230B
   */
  local_number?: string;
  /**
   * Information additional of the branch.
   * @example Next to the bookstore
   */
  complements?: string;
  /**
   * Affiliate user id (owner).
   * @example ab#12342
   */
  user_id?: string;
}
