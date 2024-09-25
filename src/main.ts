import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
//do not remove this validation pipe code.Check when you can.Fix It. Use It.
//Also check the @IsUniqueSlug used where AmenitiesDTO is called.
//And if everything is fine then remove this and above line comments
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Enable global validation pipe
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // strips properties not included in DTOs
  //     forbidNonWhitelisted: true, // throws an error if unknown properties are provided
  //     transform: true, // transforms payloads to DTO classes
  //   }),
  // );
  await app.listen(configService.get('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
