import { Controller } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { MessagePattern } from '@nestjs/microservices';
import { KAFKA_DEVELOPERS_TOPIC } from '../utils/constants/kafka-const';
@Controller('developers')
export class DevelopersController {
  constructor(private readonly DevelopersService: DevelopersService) {}

  @MessagePattern(KAFKA_DEVELOPERS_TOPIC.retrieve_developers)
  async getAllDevelopers() {
    const response = await this.DevelopersService.getAllDevelopers();
    return response;
  }

  @MessagePattern(KAFKA_DEVELOPERS_TOPIC.add_developer)
  async addNewDeveloperByAdmin(developerRequests: any) {
    const response =
      await this.DevelopersService.addNewDeveloperByAdmin(developerRequests);
    return response;
  }

  @MessagePattern(KAFKA_DEVELOPERS_TOPIC.update_developer)
  async updateDeveloperByAdmin(developerRequests: any) {
    const response = await this.DevelopersService.updateDeveloperByAdmin(
      developerRequests.id,
      developerRequests.data,
    );
    return response;
  }

  @MessagePattern(KAFKA_DEVELOPERS_TOPIC.delete_developer)
  async deleteDeveloperFromList(id: any) {
    const response = await this.DevelopersService.deleteDeveloperFromList(id);
    return response;
  }
}
