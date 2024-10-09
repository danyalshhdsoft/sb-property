import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Amenities } from './schemas/amenities.schema';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectModel(Amenities.name)
    private AmenitiesModel: Model<Amenities>,
  ) {}

  async getAllAmenities() {
    try {
      const aAmenities = await this.AmenitiesModel.find({
        deletedAt: { $eq: null },
      });
      return {
        status: 200,
        data: aAmenities,
        message: 'Amenities retrieved successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }
}
