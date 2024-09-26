import { Controller } from '@nestjs/common';
import { PropertiesService } from './properties.service';
// import { AuthFlag } from '../common/decorators/auth-flag.decorator';
// import { AuthGuard } from '../common/guards/auth.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller('properties')
// @UseGuards(AuthGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @MessagePattern('add_properties')
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

  @MessagePattern('update_properties')
  async updatePropertyByAdmin(data: any) {
    const result = await this.propertiesService.updatePropertyByAdmin(
      data.id,
      data.data,
    );
    return result;
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

  @MessagePattern('retrieve_properties')
  async getAllPropertyLists() {
    const result = await this.propertiesService.getAllPropertyLists();
    return result;
  }

  // @Get()
  // @AuthFlag('privateRoute')
  // async getAllPropertyLists() {
  //   const result = await this.propertiesService.getAllPropertyLists();
  //   return new ApiResponse(result);
  // }

  @MessagePattern('delete_properties')
  async deletePropertyFromList(id: string) {
    const result = await this.propertiesService.deletePropertyFromList(id);
    return result;
  }

  // @Delete(':id')
  // @AuthFlag('privateRoute')
  // async deletePropertyFromList(@Param('id') id: string) {
  //   const result = await this.propertiesService.deletePropertyFromList(id);
  //   return new ApiResponse(result);
  // }
}
