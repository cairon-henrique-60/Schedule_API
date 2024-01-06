import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix('schedule');

    await app.listen(3000);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
}
bootstrap();
