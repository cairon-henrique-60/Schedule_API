import { Injectable } from '@nestjs/common';

import { BadRequestError } from '../../../../http-exceptions/errors/types/BadRequestError';

import { uploadFileWithSignedUrl } from '../../../../utils/supaBase-client';
import sizeOf from 'image-size';

import { CreateUploadDto } from '../dto/create-upload-photo.dto';

@Injectable()
export class UploadPhotoService {
  async upload(createUploadDto: CreateUploadDto) {
    if (!this.isImage(createUploadDto.buffer)) {
      throw new BadRequestError('File is not an image!');
    }

    const { originalname, buffer } = createUploadDto;

    const { data, signedUrl } = await uploadFileWithSignedUrl(
      originalname,
      buffer,
    );

    return { ...data, signedUrl };
  }

  private isImage(buffer: Buffer): boolean {
    try {
      sizeOf(buffer);
      return true;
    } catch (error) {
      return false;
    }
  }
}
