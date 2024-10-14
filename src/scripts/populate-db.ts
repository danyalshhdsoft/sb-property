import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedSbDefinedAmenities } from './amenities-seeder/seed';
import { seedSbDefinedPropertyTypes } from './property-type-seeder/seed';
// import { seedSbDefinedDevelopers } from './developer-seeder/seed';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  await seedSbDefinedAmenities(appContext);
  await seedSbDefinedPropertyTypes(appContext);
  // await seedSbDefinedDevelopers(appContext);
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('Error populating database:', err);
  process.exit(1);
});
