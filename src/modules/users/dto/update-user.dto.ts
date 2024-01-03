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
  .refine((data) => {
    if (data.password && !data.current_password) {
      throw new Error('current_password is required when password is provided');
    }
    return true;
  });

export class UpdateUserDTO extends createZodDto(updateUserSchema) {}
