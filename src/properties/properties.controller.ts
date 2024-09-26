import {
  Controller,
  Post,
  Param,
  Body,
  Put,
  Get,
  Delete,
  UseGuards,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import ApiResponse from '@/src/utils/api-response.util';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthFlag } from '../common/decorators/auth-flag.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { ClientKafka } from '@nestjs/microservices';

@Controller('properties')
@UseGuards(AuthGuard)
export class PropertiesController implements OnModuleInit {
  constructor(
    private readonly propertiesService: PropertiesService,
    //Need to make this subscribeToResponseOf moduleinit global instead of doing this in all controllers
    //after finishing above task we can push these new changes
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Post('add-properties')
  @AuthFlag('privateRoute')
  async addNewPropertyByAdmin(@Body() propertyRequests: CreatePropertyDto) {
    const result =
      await this.propertiesService.addNewPropertyByAdmin(propertyRequests);
    return new ApiResponse(result);
  }

  @Put(':id')
  @AuthFlag('privateRoute')
  async updatePropertyByAdmin(
    @Param('id') id: string,
    @Body() propertyRequests: UpdatePropertyDto,
  ) {
    const result = await this.propertiesService.updatePropertyByAdmin(
      id,
      propertyRequests,
    );
    return new ApiResponse(result);
  }

  @Get()
  @AuthFlag('privateRoute')
  async getAllPropertyLists() {
    const result = await this.propertiesService.getAllPropertyLists();
    return new ApiResponse(result);
  }

  @Delete(':id')
  @AuthFlag('privateRoute')
  async deletePropertyFromList(@Param('id') id: string) {
    const result = await this.propertiesService.deletePropertyFromList(id);
    return new ApiResponse(result);
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('authorize_user');
  }
}
