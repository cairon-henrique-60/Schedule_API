import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const uploadFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number(),
});

export class CreateUploadDto extends createZodDto(uploadFileSchema) {
  /**
   * Field name of the file.
   * @example 'file'
   */
  fieldname: string;
  /**
   * Original name of the file.
   * @example 'ArquivoPadrao - Copia.xlsx'
   */
  originalname: string;
  /**
   * Encoding of the file.
   * @example '7bit'
   */
  encoding: string;
  /**
   * MIME type of the file.
   * @example 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
   */
  mimetype: string;
  /**
   * Buffer containing the file data.
   * @example <Buffer 50 4b 03 04 ...>
   */
  buffer: Buffer;
  /**
   * Size of the file in bytes.
   * @example 45100
   */
  size: number;
}
