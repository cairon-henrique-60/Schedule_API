import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const authDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthUserDTO extends createZodDto(authDtoSchema) {}
