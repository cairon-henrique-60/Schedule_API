import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const serviceSchema = z.object({
  service_name: z.string(),
  service_value: z.number(),
  expected_time: z.string(),
  is_active: z.boolean().default(true),
  user_id: z.number(),
});

export class CreateServiceDto extends createZodDto(serviceSchema) {
  /**
   * Name of the service.
   * @example Degradê
   */
  service_name: string;
  /**
   * Value of the service.
   * @example 25.00
   */
  service_value: number;
  /**
   * Time of the service.
   * @example 25:00
   */
  expected_time: string;
  /**
   * Is active of the service.
   * @example true
   */
  is_active: boolean;
  /**
   * Affiliate user id (owner).
   * @example 1
   */
  user_id: number;
}
