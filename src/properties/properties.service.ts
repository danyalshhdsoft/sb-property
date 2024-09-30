import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreatePropertyDto } from './dto/create-property.dto';
import { Properties } from './schemas/Properties.schema';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  PROPERTY_PURPOSE,
  PROPERTY_REVIEW_STATUS,
} from './enums/properties.enum';
import { LocationsService } from '../locations/location.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Properties.name)
    private PropertiesModel: Model<Properties>,
    private LocationService: LocationsService,
  ) {}
  async addNewPropertyByAdmin(propertyRequests: CreatePropertyDto) {
    try {
      const oPropertyRequests = { ...propertyRequests };

      const nBuy = 0;
      const nSale = 0;
      const nRent = 0;
      const nTotalProperties = 0;

      const oAnalyticsCounts = {
        buy: nBuy,
        sale:
          oPropertyRequests.purpose === PROPERTY_PURPOSE.SALE ? nSale + 1 : 0,
        rent:
          oPropertyRequests.purpose === PROPERTY_PURPOSE.RENT ? nRent + 1 : 0,
        totalProperties: nTotalProperties + 1,
      };

      const slug =
        oPropertyRequests.propertyListingTitle &&
        oPropertyRequests.propertyListingTitle !== ''
          ? oPropertyRequests.propertyListingTitle
              .toLowerCase()
              .replace(/\s+/g, '-')
          : '';
      propertyRequests['slug'] = slug;
      propertyRequests['analyticsCounts'] = oAnalyticsCounts;
      //save location data in locationschema
      const oAddLocationData = await this.LocationService.addNewLocation(
        oPropertyRequests?.locationMetaData,
        'google',
        oPropertyRequests?.placeId,
        'properties',
      );
      console.log(oAddLocationData);
      oPropertyRequests.location = oAddLocationData?.locationId.toString();
      oPropertyRequests.city = oAddLocationData.aCities;
      oPropertyRequests.local = oAddLocationData.aLocals;
      oPropertyRequests.buildingData.location =
        oAddLocationData?.locationId.toString();
      //check for building embedded document field in schema to save
      const newProperty = await this.PropertiesModel.create(oPropertyRequests);

      return {
        status: 200,
        data: newProperty,
        message: 'Property added to the list successfully',
      };
    } catch (oError) {
      throw new Error(oError);
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

      const oldPurpose = oExistingProperty.purpose;
      const newPurpose = propertyRequests.purpose;

      if (oldPurpose && newPurpose && oldPurpose !== newPurpose) {
        // Decrement the count for the old purpose
        if (oldPurpose === PROPERTY_PURPOSE.RENT) {
          oExistingProperty.analyticsCounts.rent = Math.max(
            0,
            oExistingProperty.analyticsCounts.rent - 1,
          );
        } else if (oldPurpose === PROPERTY_PURPOSE.SALE) {
          oExistingProperty.analyticsCounts.sale = Math.max(
            0,
            oExistingProperty.analyticsCounts.sale - 1,
          );
        } else if (oldPurpose === PROPERTY_PURPOSE.BUY) {
          oExistingProperty.analyticsCounts.buy = Math.max(
            0,
            oExistingProperty.analyticsCounts.buy - 1,
          );
        }

        // Increment the count for the new purpose
        if (newPurpose === PROPERTY_PURPOSE.RENT) {
          oExistingProperty.analyticsCounts.rent += 1;
        } else if (newPurpose === PROPERTY_PURPOSE.SALE) {
          oExistingProperty.analyticsCounts.sale += 1;
        } else if (newPurpose === PROPERTY_PURPOSE.BUY) {
          oExistingProperty.analyticsCounts.buy += 1;
        }

        propertyRequests.analyticsCounts = oExistingProperty.analyticsCounts;
      }

      const slug =
        propertyRequests.propertyListingTitle &&
        propertyRequests.propertyListingTitle !== ''
          ? propertyRequests.propertyListingTitle
              .toLowerCase()
              .replace(/\s+/g, '-')
          : '';

      propertyRequests['slug'] =
        oExistingProperty.slug && oExistingProperty.slug !== ''
          ? oExistingProperty.slug
          : slug;

      if (
        oExistingProperty &&
        propertyRequests &&
        oExistingProperty.placeId &&
        propertyRequests.placeId &&
        oExistingProperty.placeId !== propertyRequests.placeId
      ) {
        const oAddLocationData = await this.LocationService.addNewLocation(
          propertyRequests?.locationMetaData,
          'google',
          propertyRequests?.placeId,
          'properties',
        );
        propertyRequests.location = oAddLocationData?.locationId.toString();
        propertyRequests.city = oAddLocationData.aCities;
        propertyRequests.local = oAddLocationData.aLocals;
        propertyRequests.buildingData.location =
          oAddLocationData?.locationId.toString();
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
        message: 'Property updated successfully',
      };
    } catch (oError) {
      throw new Error(oError);
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
      throw new Error(oError);
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
      throw new Error(oError);
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
      throw new Error(oError);
    }
  }
}
