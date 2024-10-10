import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { PropertiesService } from './properties.service';
// import { AuthFlag } from '../common/decorators/auth-flag.decorator';
// import { AuthGuard } from '../common/guards/auth.guard';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTIES_TOPIC,
} from '../utils/constants/kafka-const';
@Controller('properties')
// @UseGuards(AuthGuard)
export class PropertiesController implements OnModuleInit {
  constructor(
    private readonly propertiesService: PropertiesService,
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE)
    private uploadsClient: ClientKafka,
  ) {}

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.add_properties)
  async addNewPropertyByAdmin(data: any) {
    return await this.propertiesService.addNewPropertyByAdmin(data);
  }

  // @Post('add-properties')
  // @AuthFlag('privateRoute')
  // async addNewPropertyByAdmin(@Body() propertyRequests: CreatePropertyDto) {
  //   const result =
  //     await this.propertiesService.addNewPropertyByAdmin(propertyRequests);
  //   return new ApiResponse(result);
  // }

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.update_properties)
  async updatePropertyByAdmin(data: any) {
    return await this.propertiesService.updatePropertyByAdmin(
      data.id,
      data.data,
    );
  }

  // @Put(':id')
  // @AuthFlag('privateRoute')
  // async updatePropertyByAdmin(
  //   @Param('id') id: string,
  //   @Body() propertyRequests: UpdatePropertyDto,
  // ) {
  //   const result = await this.propertiesService.updatePropertyByAdmin(
  //     id,
  //     propertyRequests,
  //   );
  //   return new ApiResponse(result);
  // }

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.retrieve_properties)
  async getAllPropertyLists() {
    return await this.propertiesService.getAllPropertyLists();
  }

  // @Get()
  // @AuthFlag('privateRoute')
  // async getAllPropertyLists() {
  //   const result = await this.propertiesService.getAllPropertyLists();
  //   return new ApiResponse(result);
  // }

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.delete_properties)
  async deletePropertyFromList(id: string) {
    const result = await this.propertiesService.deletePropertyFromList(id);
    return result;
  }

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.update_property_status)
  async PropertyStatusUpdate(data: any) {
    return await this.propertiesService.PropertyStatusUpdate(
      data.id,
      data.data,
    );
  }

  // @Delete(':id')
  // @AuthFlag('privateRoute')
  // async deletePropertyFromList(@Param('id') id: string) {
  //   const result = await this.propertiesService.deletePropertyFromList(id);
  //   return new ApiResponse(result);
  // }

  onModuleInit() {
    this.uploadsClient.subscribeToResponseOf(
      KAFKA_PROPERTIES_TOPIC.upload_files,
    );
  }
}
