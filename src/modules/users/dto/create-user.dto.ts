import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const userSchema = z.object({
  user_name: z.string(),
  password: z.string(),
  user_email: z.string().email(),
  phone_number: z.string().optional().nullable(),
});

export class CreateUserDTO extends createZodDto(userSchema) {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  user_name: string;
  /**
   * Password of the user.
   * @example 909090
   */
  password: string;
  /**
   *Email of the user.
   *@example levis@gmail.com
   */
  user_email: string;
  /**
   *Phone number of the user.
   *@example 997203320
   */
  phone_number?: string | null;
}
