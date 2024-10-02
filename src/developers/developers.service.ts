import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Developers } from './schemas/developers.schema';
import { Model } from 'mongoose';
import { CreateDeveloperDTO } from './dto/create-developer.dto';
import { UpdateDeveloperDTO } from './dto/update-developer.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectModel(Developers.name)
    private DevelopersModel: Model<Developers>,
  ) {}

  async getAllDevelopers() {
    try {
      const aDevelopers = await this.DevelopersModel.find({
        deletedAt: { $eq: null },
      });
      return {
        status: 200,
        data: aDevelopers,
        message: 'Developers retrieved successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async addNewDeveloperByAdmin(developerRequests: CreateDeveloperDTO) {
    try {
      const oDeveloperRequests = { ...developerRequests };

      const slug =
        oDeveloperRequests.developerName &&
        oDeveloperRequests.developerName !== ''
          ? oDeveloperRequests.developerName.toLowerCase().replace(/\s+/g, '-')
          : '';
      oDeveloperRequests['slug'] = slug;
      const newDeveloper =
        await this.DevelopersModel.create(oDeveloperRequests);

      return {
        status: 200,
        data: newDeveloper,
        message: 'Developer added to the list successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async updateDeveloperByAdmin(
    id: string,
    developerRequests: Partial<UpdateDeveloperDTO>,
  ) {
    try {
      const oExistingDeveloper = await this.DevelopersModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      }).lean();

      if (!oExistingDeveloper) {
        throw new NotFoundException('Developer not found');
      }
      const slug =
        developerRequests.developerName &&
        developerRequests.developerName !== ''
          ? developerRequests.developerName.toLowerCase().replace(/\s+/g, '-')
          : '';

      developerRequests['slug'] =
        oExistingDeveloper.slug && oExistingDeveloper.slug !== ''
          ? oExistingDeveloper.slug
          : slug;
      const oUpdateDeveloper = await this.DevelopersModel.findByIdAndUpdate(
        id,
        { $set: developerRequests },
        { new: true },
      );
      if (!oUpdateDeveloper) {
        throw new NotFoundException(`Developer with ID ${id} not found`);
      }
      return {
        status: 200,
        data: oUpdateDeveloper,
        message: 'Developer details updated successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async deleteDeveloperFromList(id: string) {
    try {
      const oExistingDeveloper = await this.DevelopersModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      });

      if (!oExistingDeveloper) {
        throw new NotFoundException(
          `Record with ID "${id}" not found or is already deleted`,
        );
      }

      await this.DevelopersModel.updateMany(
        { _id: id },
        { deletedAt: new Date() },
        { new: true },
      );

      return {
        status: 200,
        data: [],
        message: 'Developer Deleted Successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }
}
