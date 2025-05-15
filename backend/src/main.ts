import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  //test commit from another user
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'https://e61b-106-249-226-194.ngrok-free.app',
    ],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  const uploadsPath = join(process.cwd(), 'uploads');
  console.log(`Serving static files from: ${uploadsPath}`);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
    setHeaders: (res, path) => {
      console.log(`Serving file: ${path}`);
    },
  });

  await app.listen(4200);
}

bootstrap();
