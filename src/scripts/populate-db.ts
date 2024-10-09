import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedSbDefinedAmenities } from './amenities-seeder/seed';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  await seedSbDefinedAmenities(appContext);
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('Error populating database:', err);
  process.exit(1);
});
