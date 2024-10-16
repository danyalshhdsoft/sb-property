import { Controller } from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import { MessagePattern } from '@nestjs/microservices';
import { KAFKA_PROPERTY_TYPES_TOPIC } from '../utils/constants/kafka-const';
@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly PropertyTypesService: PropertyTypesService) {}

  @MessagePattern(KAFKA_PROPERTY_TYPES_TOPIC.retrieve_property_types)
  async getAllPropertyTypes() {
    return await this.PropertyTypesService.getAllPropertyTypes();
  }
}
