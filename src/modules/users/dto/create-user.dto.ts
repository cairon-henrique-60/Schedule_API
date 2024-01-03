import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = z.object({
  user_name: z.string(),
  user_email: z.string().email(),
  phone_number: z.string().optional().nullable(),
});

export class CreateUserDTO extends createZodDto(createUserSchema) {}
