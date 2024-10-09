import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Properties, PropertiesSchema } from './schemas/Properties.schema';
import { LocationsModule } from '../locations/location.module';
import { Rentals, RentalsSchema } from './schemas/rentals.schema';
import {
  Amenities,
  AmenitiesSchema,
} from '../amenities/schemas/amenities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Properties.name, schema: PropertiesSchema },
      { name: Rentals.name, schema: RentalsSchema },
      { name: Amenities.name, schema: AmenitiesSchema },
    ]),
    LocationsModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
