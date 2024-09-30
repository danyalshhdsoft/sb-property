import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MessagePattern } from '@nestjs/microservices';
import { KAFKA_PROJECTS_TOPIC } from '../utils/constants/kafka-const';
@Controller('projects')
export class ProjectsController {
  constructor(private readonly ProjectsService: ProjectsService) {}

  @MessagePattern(KAFKA_PROJECTS_TOPIC.add_project)
  async addNewProjectByAdmin(projectRequests: any) {
    try {
      const response =
        await this.ProjectsService.addNewProjectByAdmin(projectRequests);
      return response;
    } catch (oError) {
      throw new Error(oError);
    }
  }

  // @Post('add-project')
  // async addNewProjectByAdmin(@Body() projectRequests: CreateProjectDTO) {
  //   try {
  //     const response =
  //       await this.ProjectsService.addNewProjectByAdmin(projectRequests);
  //     return new ApiResponse(response);
  //   } catch (oError) {
  //     throw new Error(oError);
  //   }
  // }

  @MessagePattern(KAFKA_PROJECTS_TOPIC.update_project)
  async updateProjectByAdmin(projectRequests: any) {
    try {
      const response = await this.ProjectsService.updateProjectByAdmin(
        projectRequests.id,
        projectRequests.data,
      );
      return response;
    } catch (oError) {
      throw new Error(oError);
    }
  }

  // @Put(':id')
  // async updateProjectByAdmin(
  //   @Param('id') id: string,
  //   @Body() projectRequests: UpdateProjectDTO,
  // ) {
  //   try {
  //     const response = await this.ProjectsService.updateProjectByAdmin(
  //       id,
  //       projectRequests,
  //     );
  //     return new ApiResponse(response);
  //   } catch (oError) {
  //     throw new Error(oError);
  //   }
  // }

  @MessagePattern(KAFKA_PROJECTS_TOPIC.delete_project)
  async deleteProjectFromList(id: string) {
    try {
      const response = await this.ProjectsService.deleteProjectFromList(id);
      return response;
    } catch (oError) {
      throw new Error(oError);
    }
  }

  // @Delete(':id')
  // async deleteProjectFromList(@Param('id') id: string) {
  //   try {
  //     const response = await this.ProjectsService.deleteProjectFromList(id);
  //     return new ApiResponse(response);
  //   } catch (oError) {
  //     throw new Error(oError);
  //   }
  // }

  @MessagePattern(KAFKA_PROJECTS_TOPIC.retrieve_projects)
  async getAllProjects() {
    try {
      return await this.ProjectsService.getAllProjects();
    } catch (oError) {
      throw new Error(oError);
    }
  }
}
