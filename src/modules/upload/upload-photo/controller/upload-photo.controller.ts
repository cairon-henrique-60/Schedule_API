import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { UploadPhotoService } from '../service/upload-photo.service';

import { CreateUploadDto } from '../dto/create-upload-photo.dto';

@ApiBearerAuth()
@ApiTags('upload-photos')
@Controller('upload/photo')
export class UploadPhotoController {
  constructor(private readonly uploadPhotoService: UploadPhotoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be sent',
    type: CreateUploadDto,
  })
  async uploadFile(@UploadedFile() file: CreateUploadDto) {
    const result = await this.uploadPhotoService.upload(file);
    return result;
  }
}
