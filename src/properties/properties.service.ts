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
import { RpcException } from '@nestjs/microservices';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Properties.name)
    private PropertiesModel: Model<Properties>,
    private LocationService: LocationsService,
    private readonly elasticsearchService: ElasticsearchService,
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

      if (
        (oPropertyRequests && oPropertyRequests.placeId === '') ||
        (oPropertyRequests.locationMetaData &&
          Object.keys(oPropertyRequests.locationMetaData).length === 0)
      ) {
        throw new RpcException(
          'Something went wrong while adding location. Check your locationMetaData and placeId',
        );
      }
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
      //console.log(JSON.stringify(newProperty));

      const searchableDocument = this._constructDocument(oPropertyRequests);
      await this.elasticsearchService.indexDocument('properties', newProperty._id.toString(), searchableDocument);
      
      return {
        status: 200,
        data: newProperty,
        message: 'Property added to the list successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  _constructDocument(
    oPropertyRequests
  ) {
    return {
      washroom: oPropertyRequests.washrooms,
      bedroom: oPropertyRequests.bedrooms,
      area: oPropertyRequests.local[0].metadata.vicinity,
      building: oPropertyRequests.local[0].metadata.name,
      price: oPropertyRequests.price,
      purpose: oPropertyRequests.purpose,
      status: oPropertyRequests.status,
      propertyType: oPropertyRequests.subCategory.categoryType,
      completionStatus: oPropertyRequests.completionStatus,
      publishedAt: oPropertyRequests.publishedAt,
      squareFeet: oPropertyRequests.squareFeet,
      description: oPropertyRequests.description,
      propertyListingTitle: oPropertyRequests.propertyListingPrice
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
      
      await this.elasticsearchService.updateDocument('properties', id, propertyRequests);
      
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

  async searchProperties(
    query: string,
    bedroom: string,
    washroom: string,
    purpose: string,
    status: string,
    completionStatus: string,
    propertyType: string,
    minprice: string,
    maxprice: string,
    from: number, 
    size: number
  ): Promise<any> {
    
    const searchQuery = {
      query: {bool: { must: [], filter: {} }}
    };

    this._buildQuery(
      searchQuery,
      query,
      bedroom,
      washroom,
      purpose,
      status,
      completionStatus,
      propertyType,
      minprice,
      maxprice
    );

    return {
      status: 200,
      data: await this.elasticsearchService.search(searchQuery, from, size, 'properties')
    };
  }

  _buildQuery(
    searchQuery,
    query,
    bedroom,
    washroom,
    purpose,
    status,
    completionStatus,
    propertyType,
    minprice = "0",
    maxprice = "5000000"
  ) {
    if (query) { 
      searchQuery.query.bool.must.push({
        multi_match: {
          query, fields: ["area", "building"]
        }
      })
    }

    if (bedroom) {
      searchQuery.query.bool.must.push({
        match: {
          "bedrooms": bedroom
        }
      })
    }

    if (washroom) {
      searchQuery.query.bool.must.push({
        match: {
          "washrooms": washroom
        }
      })
    }

    if (purpose) {
      searchQuery.query.bool.must.push({
        match: {
          "purpose": purpose
        }
      })
    }

    if (status) {
      searchQuery.query.bool.must.push({
        match: {
          "status": status
        }
      })
    }

    if (propertyType) {
      searchQuery.query.bool.must.push({
        match: {
          "propertyType": propertyType
        }
      })
    }

    if (completionStatus) {
      searchQuery.query.bool.must.push({
        match: {
          "completionStatus": completionStatus
        }
      })
    }

    searchQuery.query.bool.filter = {
      range: {
        "price": {
          "gte": minprice,
          "lte": maxprice
        }
      }
    }
  }
}
