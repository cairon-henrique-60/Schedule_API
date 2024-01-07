import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as fs from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix('schedule');

    /**
     * -----------------------------------------------------------------------------
     * Swagger
     * -----------------------------------------------------------------------------
     */
    const config = new DocumentBuilder()
      .setTitle('Schedule API example')
      .setDescription('The schedule API description')
      .setVersion('0.0.1')
      .addTag('auth')
      .addTag('user')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    /**
     * -----------------------------------------------------------------------------
     * Swagger documents
     * -----------------------------------------------------------------------------
     */
    fs.writeFileSync(
      'swagger-document.json',
      JSON.stringify(document, null, 2),
    );

    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
}
bootstrap();
