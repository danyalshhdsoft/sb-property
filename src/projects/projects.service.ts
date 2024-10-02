import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Projects } from './schemas/projects.schema';
import { Model } from 'mongoose';
import { PROJECT_STATUS } from './enums/projects.enum';
import { CreateProjectDTO } from './dto/create-projects.dto';
import { UpdateProjectDTO } from './dto/update-projects.dto';
import { LocationsService } from '../locations/location.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name)
    private ProjectsModel: Model<Projects>,
    private LocationService: LocationsService,
  ) {}

  async getAllProjects() {
    try {
      const pipeline = [
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              projectStatus: PROJECT_STATUS.APPROVED,
              deletedAt: {
                $eq: null,
              },
            },
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: 'properties',
              localField: 'propertyId',
              foreignField: '_id',
              as: 'propertyDetails',
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$propertyDetails',
              preserveNullAndEmptyArrays: true,
            },
        },
      ];
      const aProjects = await this.ProjectsModel.aggregate(pipeline);
      return {
        status: 200,
        data: aProjects,
        message: 'Project retrieved successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async addNewProjectByAdmin(projectRequests: CreateProjectDTO) {
    try {
      const oProjectRequests = { ...projectRequests };

      const slug =
        oProjectRequests.projectTitle && oProjectRequests.projectTitle !== ''
          ? oProjectRequests.projectTitle.toLowerCase().replace(/\s+/g, '-')
          : '';
      projectRequests['slug'] = slug;
      if (
        (oProjectRequests && oProjectRequests.placeId === '') ||
        (oProjectRequests.locationMetaData &&
          Object.keys(oProjectRequests.locationMetaData).length === 0)
      ) {
        throw new RpcException(
          'Something went wrong while adding location. Check your locationMetaData and placeId',
        );
      }
      const oAddLocationData = await this.LocationService.addNewLocation(
        projectRequests?.locationMetaData,
        'google',
        projectRequests?.placeId,
        'projects',
      );
      oProjectRequests.location = oAddLocationData?.locationId.toString();
      oProjectRequests.buildingData.location =
        oAddLocationData?.locationId.toString();
      //save location data in locationschema
      //also save city and local and coordinates in their own specific schema
      //check for building embedded document field in schema to save
      const newProject = await this.ProjectsModel.create(oProjectRequests);

      return {
        status: 200,
        data: newProject,
        message: 'Project added to the list successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async updateProjectByAdmin(
    id: string,
    projectRequests: Partial<UpdateProjectDTO>,
  ) {
    try {
      const oExistingProject = await this.ProjectsModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      }).lean();

      if (!oExistingProject) {
        throw new NotFoundException('Project not found');
      }

      const slug =
        projectRequests.projectTitle && projectRequests.projectTitle !== ''
          ? projectRequests.projectTitle.toLowerCase().replace(/\s+/g, '-')
          : '';

      projectRequests['slug'] =
        oExistingProject.slug &&
        oExistingProject.slug !== '' &&
        oExistingProject.slug === slug
          ? oExistingProject.slug
          : slug;

      if (
        oExistingProject &&
        projectRequests &&
        oExistingProject.placeId &&
        projectRequests.placeId &&
        projectRequests.placeId !== '' &&
        Object.keys(projectRequests.locationMetaData).length > 0 &&
        oExistingProject.placeId !== projectRequests.placeId
      ) {
        const oAddLocationData = await this.LocationService.addNewLocation(
          projectRequests?.locationMetaData,
          'google',
          projectRequests?.placeId,
          'projects',
        );
        projectRequests.location = oAddLocationData?.locationId.toString();
        projectRequests.buildingData.location =
          oAddLocationData?.locationId.toString();
      }

      const oUpdateProject = await this.ProjectsModel.findByIdAndUpdate(
        id,
        { $set: projectRequests },
        { new: true },
      );
      if (!oUpdateProject) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return {
        status: 200,
        data: oUpdateProject,
        message: 'Project details updated successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async deleteProjectFromList(id: string) {
    try {
      const oExistingProject = await this.ProjectsModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      });

      if (!oExistingProject) {
        throw new NotFoundException(
          `Record with ID "${id}" not found or is already deleted`,
        );
      }

      await this.ProjectsModel.updateMany(
        { _id: id },
        { deletedAt: new Date() },
        { new: true },
      );

      return {
        status: 200,
        data: [],
        message: 'Project deleted successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }
}
