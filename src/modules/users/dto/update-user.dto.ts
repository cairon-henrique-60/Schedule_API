import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';


export const updateUserSchema = z
  .object({
    user_name: z.string().optional(),
    user_email: z.string().email().optional(),
    current_password: z.string().optional(),
    password: z.string().optional(),
    phone_number: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.password && !data.current_password) {
        return false;
      }
      return true;
    },
    { message: 'current_password is required when password is provided' },
  );

export class UpdateUserDTO extends createZodDto(updateUserSchema) {
  /**
   * New name of the user.
   * @example Levi Henrique
   */
  user_name?: string;
  /**
   * New email of the user
   * @example levis@gmail.com
   */
  user_email?: string;
  /**
   * Current password of the user
   * @example 909090
   */
  current_password?: string;
  /**
   * New password of the user
   * @example 90909012
   */
  password?: string;
  /**
   * New phone number of the user
   * @example 997221050
   */
  phone_number?: string | null;
}
