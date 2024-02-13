import { Injectable } from '@nestjs/common';
import sizeOf from 'image-size';

import { BadRequestError } from '../../../../http-exceptions/errors/types/BadRequestError';

import { uploadFileWithSignedUrl } from '../../../../utils/supaBase-client';

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

  async bulkUpload(createUploadDtoArray: CreateUploadDto[]) {
    const results = await Promise.all(
      createUploadDtoArray.map(async (createUploadDto) => {
        if (!this.isImage(createUploadDto.buffer)) {
          throw new BadRequestError(
            `File ${createUploadDto.originalname} is not an image!`,
          );
        }

        const { originalname, buffer } = createUploadDto;
        const { data, signedUrl } = await uploadFileWithSignedUrl(
          originalname,
          buffer,
        );

        return { ...data, signedUrl };
      }),
    );

    return results;
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
