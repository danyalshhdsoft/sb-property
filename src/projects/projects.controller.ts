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
import { ProjectsService } from './projects.service';
import ApiResponse from '../utils/api-response.util';
import { CreateProjectDTO } from './dto/create-projects.dto';
import { UpdateProjectDTO } from './dto/update-projects.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthFlag } from '../common/decorators/auth-flag.decorator';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly ProjectsService: ProjectsService) {}

  @Post('add-project')
  @AuthFlag('privateRoute')
  async addNewProjectByAdmin(@Body() projectRequests: CreateProjectDTO) {
    try {
      const response =
        await this.ProjectsService.addNewProjectByAdmin(projectRequests);
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Put(':id')
  @AuthFlag('privateRoute')
  async updateProjectByAdmin(
    @Param('id') id: string,
    @Body() projectRequests: UpdateProjectDTO,
  ) {
    try {
      const response = await this.ProjectsService.updateProjectByAdmin(
        id,
        projectRequests,
      );
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Delete(':id')
  @AuthFlag('privateRoute')
  async deleteProjectFromList(@Param('id') id: string) {
    try {
      const response = await this.ProjectsService.deleteProjectFromList(id);
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  @Get()
  @AuthFlag('privateRoute')
  async getAllProjects() {
    try {
      const response = await this.ProjectsService.getAllProjects();
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }
}
