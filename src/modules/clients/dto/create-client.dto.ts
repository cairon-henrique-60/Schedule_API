import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const clientsSchema = z.object({
  client_name: z.string(),
  first_name: z.string(),
  birth_date: z.string(),
  client_phone: z.string(),
  is_active: z.boolean().default(true),
  branch_id: z.number().int().positive(),
});

export class CreateClientDto extends createZodDto(clientsSchema) {
  /**
   * Name of the client.
   * @example John
   */
  client_name: string;
  /**
   * First name of the client.
   * @example Doe
   */
  first_name: string;
  /**
   * Birth date of the client.
   * @example 11/03/1994
   */
  birth_date: string;
  /**
   * Phone of the client.
   * @example 32227568
   */
  client_phone: string;
  /**
   * Is active of the client.
   * @example true
   */
  is_active: boolean;
  /**
   * Branch of the client.
   * @example 1
   */
  branch_id: number;
}
