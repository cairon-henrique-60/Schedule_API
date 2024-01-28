import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const serviceSchema = z.object({
  service_name: z.string().optional(),
  service_value: z.number().optional(),
  expected_time: z.string().optional(),
  is_active: z.boolean().optional(),
  user_id: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export class QuerysServiceDto extends createZodDto(serviceSchema) {
  /**
   * Name of the service.
   * @example Degradê
   */
  @ApiPropertyOptional()
  service_name?: string;
  /**
   * Value of the service.
   * @example 25.00
   */
  @ApiPropertyOptional()
  service_value?: number;
  /**
   * Time of the service.
   * @example 25:00
   */
  @ApiPropertyOptional()
  expected_time?: string;
  /**
   * Is active of the service.
   * @example true
   */
  @ApiPropertyOptional()
  is_active?: boolean;
  /**
   * Affiliate user id (owner).
   * @example 1
   */
  @ApiPropertyOptional()
  user_id?: number;
  /**
   *Date create of the service.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  createdAt?: string;
  /**
   *Date update of the service.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  updatedAt?: string;
  /**
   *Date delete of the service.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  deletedAt?: string;
  /**
   *Limite data of the paginate service.
   *@example 100
   */
  @ApiPropertyOptional()
  limit?: number;
  /**
   *Current page of the paginate service.
   *@example 1
   */
  @ApiPropertyOptional()
  page?: number;
}
