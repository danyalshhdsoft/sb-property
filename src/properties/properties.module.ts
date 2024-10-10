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
import { FloorPlans, FloorPlansSchema } from './schemas/floor-plans.schema';
import { PropertiesBroadcastService } from './properties-broadcast.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Properties.name, schema: PropertiesSchema },
      { name: Rentals.name, schema: RentalsSchema },
      { name: Amenities.name, schema: AmenitiesSchema },
      { name: FloorPlans.name, schema: FloorPlansSchema },
    ]),
    LocationsModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesBroadcastService],
})
export class PropertiesModule {}
