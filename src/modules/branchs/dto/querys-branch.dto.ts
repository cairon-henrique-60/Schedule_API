import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const branchsSchema = z.object({
  branch_name: z.string().optional(),
  cnpj: z.string().min(14).max(14).optional().nullable(),
  street: z.string().optional(),
  cep: z.string().min(8).max(8).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  local_number: z.string().max(10).optional(),
  branch_phone: z.string().optional().nullable(),
  complements: z.string().optional(),
  user_id: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export class QuerysBranchDto extends createZodDto(branchsSchema) {
  /**
   * Name of the branch.
   * @example Brooklyn Cookies
   */
  @ApiPropertyOptional()
  branch_name?: string;
  /**
   * CNPJ of the branch.
   * @example 12345678000200
   */
  @ApiPropertyOptional()
  cnpj?: string;
  /**
   * Street of the branch.
   * @example R Alameda Islim
   */
  @ApiPropertyOptional()
  street?: string;
  /**
   * CEP of the branch.
   * @example 36150000
   */
  @ApiPropertyOptional()
  cep?: string;
  /**
   * City of the branch.
   * @example Rio de Janeiro
   */
  @ApiPropertyOptional()
  city?: string;
  /**
   * District of the branch.
   * @example Bairro dos Caramelos
   */
  @ApiPropertyOptional()
  district?: string;
  /**
   * Number residence of the branch.
   * @example 230B
   */
  @ApiPropertyOptional()
  local_number?: string;
  /**
   * Number phone of the branch.
   * @example 32227460
   */
  @ApiPropertyOptional()
  branch_phone?: string;
  /**
   * Information additional of the branch.
   * @example Next to the bookstore
   */
  @ApiPropertyOptional()
  complements?: string;
  /**
   * Owner of the branch.
   * @example 1
   */
  @ApiPropertyOptional()
  user_id?: number;
  /**
   *Date create of the branch.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  createdAt?: string;
  /**
   *Date update of the branch.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  updatedAt?: string;
  /**
   *Date delete of the branch.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  deletedAt?: string;
  /**
   *Limite data of the paginate branchs.
   *@example 100
   */
  @ApiPropertyOptional()
  limit?: number;
  /**
   *Current page of the paginate branchs.
   *@example 1
   */
  @ApiPropertyOptional()
  page?: number;
}
