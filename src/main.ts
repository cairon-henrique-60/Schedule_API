import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import configSwagger from 'src/swagger/swagger.config';

import { ENV_VARIABLES } from 'src/config/env.config';

import * as fs from 'fs';

import { UnauthorizedInterceptor } from 'src/http-exceptions/errors/interceptors/unauthorized.interceptor';
import { BadRequestInterceptor } from './http-exceptions/errors/interceptors/badRequest.interceptor';
import { NotFoundInterceptor } from 'src/http-exceptions/errors/interceptors/notFound.interceptor';
import { DataBaseInterceptor } from './http-exceptions/errors/interceptors/dataBase.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix('schedule');

    /**
     * -----------------------------------------------------------------------------
     * HTTP Interceptor
     * -----------------------------------------------------------------------------
     */
    app.useGlobalInterceptors(new UnauthorizedInterceptor());
    app.useGlobalInterceptors(new BadRequestInterceptor());
    app.useGlobalInterceptors(new NotFoundInterceptor());
    app.useGlobalInterceptors(new DataBaseInterceptor());

    /**
     * -----------------------------------------------------------------------------
     * Swagger
     * -----------------------------------------------------------------------------
     */

    const document = SwaggerModule.createDocument(app, configSwagger);

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

    await app.listen(ENV_VARIABLES.PROJECT_PORT || 3000);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
}
bootstrap();
