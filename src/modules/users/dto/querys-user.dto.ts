import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const querysUserSchema = z.object({
  user_name: z.string().optional(),
  user_email: z.string().email().optional(),
  phone_number: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export class QueryUserDTO extends createZodDto(querysUserSchema) {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  @ApiPropertyOptional()
  user_name?: string;
  /**
   *Email of the user.
   *@example levis@gmail.com
   */
  @ApiPropertyOptional()
  user_email?: string;
  /**
   *Phone number of the user.
   *@example 997203320
   */
  @ApiPropertyOptional()
  phone_number?: string | null;
  /**
   *Date create of the user.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  createdAt?: string;
  /**
   *Date update of the user.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  updatedAt?: string;
  /**
   *Date delete of the user.
   *@example 2024-01-06
   */
  @ApiPropertyOptional()
  deletedAt?: string;
}
