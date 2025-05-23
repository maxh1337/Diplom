import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
  ],
  providers: [SeedService],
})
export class SeedModule {}
