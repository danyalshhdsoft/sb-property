import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PropertyType,
  PropertyTypesSchema,
} from './schemas/property-type.schema';
import { PropertyTypesService } from './property-types.service';
import { PropertyTypesController } from './property-types.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PropertyType.name, schema: PropertyTypesSchema },
    ]),
  ],
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService],
  exports: [PropertyTypesService],
})
export class PropertyTypesModule {}
