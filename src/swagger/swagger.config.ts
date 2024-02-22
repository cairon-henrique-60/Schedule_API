import { DocumentBuilder } from '@nestjs/swagger';

const configSwagger = new DocumentBuilder()
  .setTitle('Schedule API example')
  .setDescription('The schedule API description')
  .setVersion('0.0.1')
  .addTag('auth')
  .addTag('user')
  .addTag('branchs')
  .addTag('services')
  .addTag('clients')
  .addTag('upload-photos')
  .addTag('upload-photos-user')
  .addBearerAuth()
  .build();

export default configSwagger;
