import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../src/seed/seed.module';
import { SeedService } from '../src/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  await seedService.seedAdmin();
  await app.close();
}

bootstrap()
  .then(() => {
    console.log('Seeding complete');
  })
  .catch((err) => {
    console.error('Seeding failed', err);
  });
