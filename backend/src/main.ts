import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://webapp-react-khaki.vercel.app',
      'https://free-mails-camp.loca.lt',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'ngrok-skip-browser-warning',
      'Authorization',
      'x-init-data',
    ],
  });

  const uploadsPath = join(process.cwd(), 'uploads');

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
    setHeaders: (res, path) => {
      console.log(`Serving file: ${path}`);
    },
  });

  console.log('🚀 Starting NestJS server...');
  await app.listen(4200);
  console.log('✅ Server listening on port 4200');
  console.log(`Serving static files from: ${uploadsPath}`);
}

bootstrap();
