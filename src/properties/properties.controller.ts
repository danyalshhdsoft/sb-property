import { Controller } from '@nestjs/common';
import { PropertiesService } from './properties.service';
// import { AuthFlag } from '../common/decorators/auth-flag.decorator';
// import { AuthGuard } from '../common/guards/auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  KAFKA_ELASTIC_SEARCH_TOPIC,
  KAFKA_PROPERTIES_TOPIC,
} from '../utils/constants/kafka-const';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
@Controller('properties')
// @UseGuards(AuthGuard)
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.add_properties)
  async addNewPropertyByAdmin(data: any) {
    const { oPropertyRequest, imagesMeta } = data;
    return await this.propertiesService.addNewPropertyByAdmin(
      oPropertyRequest,
      imagesMeta,
    );
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
    const { id, oPropertyRequest, imagesMeta } = data;
    return await this.propertiesService.updatePropertyByAdmin(
      id,
      oPropertyRequest,
      imagesMeta,
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
  async getAllPropertyLists(@Payload() data: any) {
    return await this.propertiesService.getAllPropertyLists(data.admin);
  }

  @MessagePattern(KAFKA_PROPERTIES_TOPIC.get_property_by_id)
  async getPropertiesById(@Payload() data: any) {
    return await this.propertiesService.getPropertiesById(data.id);
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

  @MessagePattern(KAFKA_ELASTIC_SEARCH_TOPIC.search)
  async getProperties(data: any) {
    const response = await this.propertiesService.searchProperties(
      data.query,
      data.bedroom,
      data.washroom,
      data.purpose,
      data.status,
      data.completionStatus,
      data.propertyType,
      data.minprice,
      data.maxprice,
      data.from,
      data.size,
    );
    return response;
  }

  @MessagePattern(KAFKA_ELASTIC_SEARCH_TOPIC.searchAutocomplete)
  async autocomplete(data: any) {
    const results = await this.elasticsearchService.searchAutocomplete(
      data,
      'properties',
    );
    return results;
  }

  // @Delete(':id')
  // @AuthFlag('privateRoute')
  // async deletePropertyFromList(@Param('id') id: string) {
  //   const result = await this.propertiesService.deletePropertyFromList(id);
  //   return new ApiResponse(result);
  // }
}
