import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const serviceSchema = z.object({
  service_name: z.string().optional(),
  service_value: z.number().optional(),
  expected_time: z.string().optional(),
  is_active: z.boolean().optional(),
  user_id: z.number().optional(),
});

export class UpdateServiceDto extends createZodDto(serviceSchema) {
  /**
   * Name of the service.
   * @example Degradê
   */
  service_name?: string;
  /**
   * Value of the service.
   * @example 25.00
   */
  service_value?: number;
  /**
   * Time of the service.
   * @example 25:00
   */
  expected_time?: string;
  /**
   * Is active of the service.
   * @example true
   */
  is_active?: boolean;
  /**
   * Affiliate user id (owner).
   * @example 1
   */
  user_id?: number;
}
