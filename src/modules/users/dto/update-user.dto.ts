import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const updateUserSchema = z.object({
  user_name: z.string().optional(),
  user_email: z.string().email().optional(),
  phone_number: z.string().optional().nullable(),
});

export class UpdateUserDTO extends createZodDto(updateUserSchema) {}
