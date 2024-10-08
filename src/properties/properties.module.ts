import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Properties, PropertiesSchema } from './schemas/Properties.schema';
import { LocationsModule } from '../locations/location.module';
import { ElasticSearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Properties.name, schema: PropertiesSchema },
    ]),
    LocationsModule,
    ElasticSearchModule
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
