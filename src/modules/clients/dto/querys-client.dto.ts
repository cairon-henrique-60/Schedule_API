import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const clientsSchema = z.object({
  client_name: z.string().optional(),
  first_name: z.string().optional(),
  birth_date: z.string().optional(),
  branch_id: z.number().int().positive().optional(),
  is_active: z.boolean().default(true).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export class QuerysClientDto extends createZodDto(clientsSchema) {
  /**
   * Name of the client.
   * @example John
   */
  @ApiPropertyOptional()
  client_name?: string;
  /**
   * First name of the client.
   * @example Doe
   */
  @ApiPropertyOptional()
  first_name?: string;
  /**
   * Birth date of the client.
   * @example 11/03/1994
   */
  @ApiPropertyOptional()
  birth_date?: string;
  /**
   * Is active of the client.
   * @example true
   */
  @ApiPropertyOptional()
  is_active?: boolean;
  /**
   * Branch of the client.
   * @example 1
   */
  @ApiPropertyOptional()
  branch_id?: number;
  /**
   *Date create of the client.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  createdAt?: string;
  /**
   *Date update of the client.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  updatedAt?: string;
  /**
   *Date delete of the client.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  deletedAt?: string;
  /**
   *Limite data of the paginate clients.
   *@example 100
   */
  @ApiPropertyOptional()
  limit?: number;
  /**
   *Current page of the paginate clients.
   *@example 1
   */
  @ApiPropertyOptional()
  page?: number;
}
