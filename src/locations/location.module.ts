import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Locations, LocationsSchema } from './schemas/location.schema';
import { LocationsController } from './location.controller';
import { LocationsService } from './location.service';
import { HttpModule } from '@nestjs/axios';
import { Cities, CitiesSchema } from './schemas/city.schema';
import { Locals, LocalsSchema } from './schemas/locals.schema';
import { Coordinates, CoordinatesSchema } from './schemas/coordinates.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Locations.name, schema: LocationsSchema },
      { name: Cities.name, schema: CitiesSchema },
      { name: Locals.name, schema: LocalsSchema },
      { name: Coordinates.name, schema: CoordinatesSchema },
    ]),
    HttpModule,
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
