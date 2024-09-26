import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import ApiResponse from '../utils/api-response.util';
import { CreateDeveloperDTO } from './dto/create-developer.dto';
import { UpdateDeveloperDTO } from './dto/update-developer.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthFlag } from '../common/decorators/auth-flag.decorator';

@Controller('developers')
@UseGuards(AuthGuard)
export class DevelopersController {
  constructor(private readonly DevelopersService: DevelopersService) {}

  @Get()
  @AuthFlag('privateRoute')
  async getAllDevelopers() {
    try {
      const response = await this.DevelopersService.getAllDevelopers();
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Post('add-developer')
  @AuthFlag('privateRoute')
  async addNewDeveloperByAdmin(@Body() developerRequests: CreateDeveloperDTO) {
    try {
      const response =
        await this.DevelopersService.addNewDeveloperByAdmin(developerRequests);
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Put(':id')
  @AuthFlag('privateRoute')
  async updateDeveloperByAdmin(
    @Param('id') id: string,
    @Body() developerRequests: UpdateDeveloperDTO,
  ) {
    try {
      const response = await this.DevelopersService.updateDeveloperByAdmin(
        id,
        developerRequests,
      );
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Delete(':id')
  @AuthFlag('privateRoute')
  async deleteDeveloperFromList(@Param('id') id: string) {
    try {
      const response = await this.DevelopersService.deleteDeveloperFromList(id);
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }
}
