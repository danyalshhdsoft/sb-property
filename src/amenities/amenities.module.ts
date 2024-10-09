import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Amenities, AmenitiesSchema } from './schemas/amenities.schema';
import { AmenitiesService } from './amenities.service';
// import { AmenitiesController } from './amenities.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Amenities.name, schema: AmenitiesSchema },
    ]),
  ],
  //   controllers: [AmenitiesController],
  providers: [AmenitiesService],
  exports: [AmenitiesService],
})
export class AmenitiesModule {}
