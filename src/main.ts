import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix('schedule');

    // Swagger config
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Schedule API example')
      .setDescription('The schedule API description')
      .setVersion('1.0')
      .addTag('auth')
      .addTag('user')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
}
bootstrap();
