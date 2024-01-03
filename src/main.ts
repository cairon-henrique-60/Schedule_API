import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  try {
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix('schedule');
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}
bootstrap();
