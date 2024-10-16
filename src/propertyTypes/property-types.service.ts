import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PropertyType } from './schemas/property-type.schema';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PropertyTypesService {
  constructor(
    @InjectModel(PropertyType.name)
    private PropertyTypesModel: Model<PropertyType>,
  ) {}

  async getAllPropertyTypes() {
    try {
      const aPropertyTypes = await this.PropertyTypesModel.find({
        deletedAt: { $eq: null },
        isActive: true,
      });
      return {
        status: 200,
        data: aPropertyTypes,
        message: 'PropertyTypes retrieved successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }
}
