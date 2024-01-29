import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const clientsSchema = z.object({
  client_name: z.string().optional(),
  first_name: z.string().optional(),
  birth_date: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
  branch_id: z.number().int().positive().optional(),
});

export class UpdateClientDto extends createZodDto(clientsSchema) {
  /**
   * Name of the client.
   * @example John
   */
  client_name?: string;
  /**
   * First name of the client.
   * @example Doe
   */
  first_name?: string;
  /**
   * Birth date of the client.
   * @example 11/03/1994
   */
  birth_date?: string;
  /**
   * Is active of the client.
   * @example true
   */
  is_active?: boolean;
  /**
   * Branch of the client.
   * @example 1
   */
  branch_id?: number;
}
