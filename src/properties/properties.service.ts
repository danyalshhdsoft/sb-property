import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreatePropertyDto } from './dto/create-property.dto';
import { Properties } from './schemas/Properties.schema';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PROPERTY_REVIEW_STATUS } from './enums/properties.enum';
import { LocationsService } from '../locations/location.service';
import { RpcException } from '@nestjs/microservices';
import {
  FloorPlansImagesDTO,
  RentalsSchemaDTO,
} from './dto/property-schema-sub.dto';
import { Rentals } from './schemas/rentals.schema';
import { Amenities } from '../amenities/schemas/amenities.schema';
import { FloorPlans } from './schemas/floor-plans.schema';
@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Properties.name)
    private PropertiesModel: Model<Properties>,
    private LocationService: LocationsService,
    @InjectModel(Rentals.name)
    private RentalsModel: Model<Rentals>,
    @InjectModel(Amenities.name)
    private AmenitiesModel: Model<Amenities>,
    @InjectModel(FloorPlans.name)
    private FloorPlansModel: Model<FloorPlans>,
  ) {}

  async addNewRentalsData(oRentalData: RentalsSchemaDTO) {
    try {
      const response = await this.RentalsModel.create(oRentalData);
      return response;
    } catch (oError) {
      throw oError;
    }
  }

  async addNewFloorPlanData(
    oFloorPlans: FloorPlansImagesDTO,
    locationId: string,
    bedroomCount: number,
    washroomCount: number,
  ) {
    try {
      oFloorPlans['addedBy'] = '60d5ec49f9e7a3c1d4f0b8ca';
      oFloorPlans['images'] = {
        image2ds: oFloorPlans.image2ds,
        image3ds: oFloorPlans.image3ds,
        videos: oFloorPlans.videos,
        others: oFloorPlans.others,
      };
      oFloorPlans['location'] = locationId;
      oFloorPlans['bedroomCount'] = bedroomCount;
      oFloorPlans['washroomCount'] = washroomCount;
      const response = await this.FloorPlansModel.create(oFloorPlans);
      return response;
    } catch (oError) {
      throw oError;
    }
  }

  async addNewPropertyByAdmin(propertyRequests: CreatePropertyDto) {
    try {
      const oPropertyRequests = { ...propertyRequests };

      const slug =
        oPropertyRequests.title && oPropertyRequests.title !== ''
          ? oPropertyRequests.title.toLowerCase().replace(/\s+/g, '-')
          : '';
      propertyRequests['slug'] = slug;

      if (
        (oPropertyRequests && oPropertyRequests.placeId === '') ||
        (oPropertyRequests.locationMetaData &&
          Object.keys(oPropertyRequests.locationMetaData).length === 0)
      ) {
        throw new RpcException('Location data fields are empty');
      }
      //save location data in locationschema
      const oAddLocationData = await this.LocationService.addNewLocation(
        oPropertyRequests?.locationMetaData,
        'google',
        oPropertyRequests?.placeId,
        'properties',
      );
      console.log(oAddLocationData);
      oPropertyRequests['location'] = oAddLocationData?.locationId.toString();
      oPropertyRequests['city'] = oAddLocationData?.cities?._id;
      oPropertyRequests['local'] = oAddLocationData?.oLocals?._id;
      //need to do something with building data schema and the id storing in properties schema
      // oPropertyRequests['buildingData'].location =
      //   oAddLocationData?.locationId.toString();
      const oRentals = await this.addNewRentalsData(oPropertyRequests.rentals);
      oPropertyRequests['rental'] = oRentals._id;

      const totalAreaInSquareFeet = oPropertyRequests.totalAreaInSquareFeet;
      const areaInSquareMeters = totalAreaInSquareFeet * 0.092903;
      const areaInSquareYards = totalAreaInSquareFeet * 0.111111;
      oPropertyRequests['squareFeet'] = {
        areaInSquareMeters: areaInSquareMeters,
        areaInSquareYards: areaInSquareYards,
        totalAreaInSquareFeet: totalAreaInSquareFeet,
        pricePerSquareFeet: oPropertyRequests.pricePerSquareFeet,
      };
      const oFloorPlans = await this.addNewFloorPlanData(
        propertyRequests.floorPlans,
        oAddLocationData?.locationId.toString(),
        oPropertyRequests.bedrooms,
        oPropertyRequests.washrooms,
      );
      oPropertyRequests['floorPlan'] = oFloorPlans._id;
      //check for building embedded document field in schema to save
      const newProperty = await this.PropertiesModel.create(oPropertyRequests);
      return {
        status: 200,
        data: newProperty,
        message: 'Property added to the list successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async updateRentalsData(oRentalData: Partial<RentalsSchemaDTO>, id: string) {
    try {
      const oExistingRentals = await this.RentalsModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      }).lean();

      if (!oExistingRentals) {
        // add new rentals (const oAddRental) and send the response
        const oAddRentals = await this.RentalsModel.create(oRentalData);
        if (!oAddRentals) {
          throw new NotFoundException(`Rentals with ID ${id} not found`);
        }
        return oAddRentals._id;
      }
      const oUpdateRentals = await this.PropertiesModel.findByIdAndUpdate(
        id,
        { $set: oRentalData },
        { new: true },
      );
      if (!oUpdateRentals) {
        throw new NotFoundException(`Rentals with ID ${id} not found`);
      }
      return oUpdateRentals._id;
    } catch (oError) {
      throw oError;
    }
  }

  async updatePropertyByAdmin(
    id: string,
    propertyRequests: Partial<UpdatePropertyDto>,
  ) {
    try {
      const oExistingProperty = await this.PropertiesModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      }).lean();

      if (!oExistingProperty) {
        throw new NotFoundException('Property not found');
      }

      const slug =
        propertyRequests.title && propertyRequests.title !== ''
          ? propertyRequests.title.toLowerCase().replace(/\s+/g, '-')
          : '';

      propertyRequests['slug'] =
        oExistingProperty.slug &&
        oExistingProperty.slug !== '' &&
        oExistingProperty.slug === slug
          ? oExistingProperty.slug
          : slug;

      if (
        oExistingProperty &&
        propertyRequests &&
        oExistingProperty.placeId &&
        propertyRequests.placeId &&
        propertyRequests.placeId !== '' &&
        Object.keys(propertyRequests.locationMetaData).length > 0 &&
        oExistingProperty.placeId !== propertyRequests.placeId
      ) {
        const oAddLocationData = await this.LocationService.addNewLocation(
          propertyRequests?.locationMetaData,
          'google',
          propertyRequests?.placeId,
          'properties',
        );
        propertyRequests['location'] = oAddLocationData?.locationId.toString();
        propertyRequests['city'] = oAddLocationData?.cities?._id;
        propertyRequests['local'] = oAddLocationData?.oLocals?._id;
        propertyRequests['buildingData'].location =
          oAddLocationData?.locationId.toString();
      }

      const oUpdatedRentalId = await this.updateRentalsData(
        propertyRequests.rentals,
        propertyRequests.rentalId,
      );
      propertyRequests['rental'] = oUpdatedRentalId;

      //updation of squarefeet data is pending in this API
      if (
        propertyRequests.totalAreaInSquareFeet &&
        propertyRequests.totalAreaInSquareFeet !== null &&
        !Number.isNaN(propertyRequests.totalAreaInSquareFeet)
      ) {
        const totalAreaInSquareFeet = propertyRequests.totalAreaInSquareFeet;
        const areaInSquareMeters = totalAreaInSquareFeet * 0.092903;
        const areaInSquareYards = totalAreaInSquareFeet * 0.111111;
        propertyRequests['squareFeet'] = {
          areaInSquareMeters: areaInSquareMeters,
          areaInSquareYards: areaInSquareYards,
          totalAreaInSquareFeet: totalAreaInSquareFeet,
          pricePerSquareFeet: propertyRequests.pricePerSquareFeet,
        };
      }
      const oUpdateProperty = await this.PropertiesModel.findByIdAndUpdate(
        id,
        { $set: propertyRequests },
        { new: true },
      );
      if (!oUpdateProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      return {
        status: 200,
        data: oUpdateProperty,
        message: 'Property details updated successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async getAllPropertyLists() {
    try {
      const aPropertyLists = await this.PropertiesModel.find({
        reviewStatus: PROPERTY_REVIEW_STATUS.APPROVED,
        deletedAt: { $eq: null },
      }).exec();
      return {
        status: 200,
        data: aPropertyLists,
        message: 'Property retrieved successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async deletePropertyFromList(id: string) {
    try {
      const oExistingProperty = await this.PropertiesModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      });

      if (!oExistingProperty) {
        throw new NotFoundException(
          `Record with ID "${id}" not found or is already deleted`,
        );
      }

      await this.PropertiesModel.updateMany(
        { _id: id },
        { deletedAt: new Date() },
        { new: true },
      );
      return {
        status: 200,
        data: [],
        message: 'Property deleted successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async PropertyStatusUpdate(
    id: string,
    oPropertyRequests: Partial<UpdatePropertyDto>,
  ) {
    try {
      const oUpdateProperty = await this.PropertiesModel.findOneAndUpdate(
        { _id: id },
        { $set: oPropertyRequests },
        { new: true },
      );
      if (!oUpdateProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      return {
        status: 200,
        data: oUpdateProperty,
        message:
          'Property is now on ' +
          oUpdateProperty?.reviewStatus?.toLowerCase() +
          ' status',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }
}
