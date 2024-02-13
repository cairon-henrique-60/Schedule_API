import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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

  @Post('bulk')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Array of files to be uploaded',
    type: [CreateUploadDto],
  })
  async uploadBulkFiles(@UploadedFiles() file: CreateUploadDto[]) {
    const result = await this.uploadPhotoService.bulkUpload(file);
    return result;
  }
}
