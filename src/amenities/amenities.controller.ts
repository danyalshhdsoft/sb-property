import { Controller } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { MessagePattern } from '@nestjs/microservices';
import { KAFKA_AMENITIES_TOPIC } from '../utils/constants/kafka-const';
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @MessagePattern(KAFKA_AMENITIES_TOPIC.retrieve_amenities)
  async getAllAmenities() {
    return await this.amenitiesService.getAllAmenities();
  }
}
