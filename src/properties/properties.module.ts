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
import { Documents, DocumentsSchema } from '../common/schemas/documents.schema';
import { ElasticSearchModule } from '../elasticsearch/elasticsearch.module';
import {
  PropertyType,
  PropertyTypesSchema,
} from '../common/schemas/property-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Properties.name, schema: PropertiesSchema },
      { name: Rentals.name, schema: RentalsSchema },
      { name: Amenities.name, schema: AmenitiesSchema },
      { name: FloorPlans.name, schema: FloorPlansSchema },
      { name: Documents.name, schema: DocumentsSchema },
      { name: PropertyType.name, schema: PropertyTypesSchema },
    ]),
    LocationsModule,
    ElasticSearchModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
