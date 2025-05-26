import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { csrfExclude } from './csrf.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.use(
    csrfExclude([
      '/api/auth/login',
      '/api/auth/logout',
      '/api/auth/access-token',
      '/api/public',
      '/api/user',
      '/api/event',
      '/api/feedback',
    ]),
  );

  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    next(err);
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://webapp-react-khaki.vercel.app',
      'https://empty-houses-know.loca.lt',
      'https://ya-budu.ru',
      'https://ya-budu.ru/web-app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'ngrok-skip-browser-warning',
      'Authorization',
      'x-init-data',
      'Recaptcha',
      'X-CSRF-Token',
    ],
  });

  const uploadsPath = join(process.cwd(), 'uploads');

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
    setHeaders: (res, path) => {
      console.log(`Serving file: ${path}`);
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Event API')
    .setDescription('Документация API для Telegram Events')
    .setVersion('1.0')
    .addTag('event')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  console.log('🚀 Starting NestJS server...');
  await app.listen(4200);
  console.log('✅ Server listening on port 4200');
  console.log(`Serving static files from: ${uploadsPath}`);
}

bootstrap();
