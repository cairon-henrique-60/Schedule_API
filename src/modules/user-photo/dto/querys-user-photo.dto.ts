import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const userPhotoSchema = z.object({
  original_name: z.string().optional(),
  size: z.number().positive().optional(),
  url: z.string().optional(),
  user_id: z.number().int().positive().optional(),
});

export class QuerysUserPhotoDto extends createZodDto(userPhotoSchema) {
  /**
   * Field name of the file.
   * @example 'file name'
   */
  @ApiPropertyOptional()
  original_name?: string;
  /**
   * Size of the file in bytes.
   * @example 45100
   */
  @ApiPropertyOptional()
  size?: number;
  /**
   * URL of the file.
   * @example 'https://example.com'
   */
  @ApiPropertyOptional()
  url?: string;
  /**
   * User id of the reference file.
   * @example '1'
   */
  @ApiPropertyOptional()
  user_id?: number;
  /**
   *Date create of the file.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  createdAt?: string;
  /**
   *Date update of the file.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  updatedAt?: string;
  /**
   *Date delete of the file.
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
