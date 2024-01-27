import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { Branch } from '../../../modules/branchs/entities/branch.entity';

const serviceSchema = z.object({
  service_name: z.string().optional(),
  service_value: z.number().optional(),
  expected_time: z.string().optional(),
  is_active: z.boolean().optional(),
  branchs: z
    .array(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .optional(),
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
   * Branchs of the service
   * @example [
   *   {id: 1},
   *   {id: 2}
   * ]
   */
  services?: Branch[];
}
