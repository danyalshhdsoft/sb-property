import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';

import { CreatePropertyDto } from './dto/create-property.dto';
import { Properties } from './schemas/Properties.schema';
import { UpdatePropertyDto } from './dto/update-property.dto';
// import { PROPERTY_REVIEW_STATUS } from './enums/properties.enum';
import { LocationsService } from '../locations/location.service';
import { RpcException } from '@nestjs/microservices';
import {
  // FloorPlansImagesDTO,
  RentalsSchemaDTO,
} from './dto/property-schema-sub.dto';
import { Rentals } from './schemas/rentals.schema';
import { Amenities } from '../amenities/schemas/amenities.schema';
import { FloorPlans } from './schemas/floor-plans.schema';
import { Documents } from '../common/schemas/documents.schema';
import { FileDocumentDTO } from '../common/dto/create-document.dto';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { PropertyType } from '../propertyTypes/schemas/property-type.schema';

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
    @InjectModel(Documents.name)
    private DocumentsModel: Model<Documents>,
    @InjectModel(PropertyType.name)
    private PropertyTypesModel: Model<PropertyType>,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async addNewRentalsData(oRentalData: RentalsSchemaDTO) {
    try {
      const response = await this.RentalsModel.create(oRentalData);
      return response;
    } catch (oError) {
      throw oError;
    }
  }

  async savePropertyDocumentsMetaData(metadata: FileDocumentDTO) {
    try {
      const response = await this.DocumentsModel.insertMany(metadata);
      return response;
    } catch (oError) {
      throw oError;
    }
  }

  //Needs a discussion to integrate floorplan.
  //For now this is optional as the structure is not confirmed.

  // async addNewFloorPlanData(
  //   oFloorPlans: FloorPlansImagesDTO,
  //   locationId: string,
  //   bedroomCount: number,
  //   washroomCount: number,
  // ) {
  //   try {
  //     oFloorPlans['addedBy'] = '60d5ec49f9e7a3c1d4f0b8ca';
  //     oFloorPlans['images'] = {
  //       image2ds: oFloorPlans.image2ds,
  //       image3ds: oFloorPlans.image3ds,
  //       videos: oFloorPlans.videos,
  //       others: oFloorPlans.others,
  //     };
  //     oFloorPlans['location'] = locationId;
  //     oFloorPlans['bedroomCount'] = bedroomCount;
  //     oFloorPlans['washroomCount'] = washroomCount;
  //     const response = await this.FloorPlansModel.create(oFloorPlans);
  //     return response;
  //   } catch (oError) {
  //     throw oError;
  //   }
  // }

  async addNewPropertyByAdmin(
    propertyRequests: CreatePropertyDto,
    imagesMeta: any,
  ) {
    try {
      const oPropertyRequests = { ...propertyRequests };

      const slug =
        oPropertyRequests.title && oPropertyRequests.title !== ''
          ? oPropertyRequests.title.toLowerCase().replace(/\s+/g, '-')
          : '';
      oPropertyRequests['slug'] = slug;

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

      //Needs a discussion to integrate floorplan.
      //For now this is optional as the structure is not confirmed.

      // const oFloorPlans = await this.addNewFloorPlanData(
      //   propertyRequests.floorPlans,
      //   oAddLocationData?.locationId.toString(),
      //   oPropertyRequests.bedrooms,
      //   oPropertyRequests.washrooms,
      // );
      // oPropertyRequests['floorPlan'] = oFloorPlans._id;

      //check for building embedded document field in schema to save
      const newProperty = await this.PropertiesModel.create(oPropertyRequests);
      if (!newProperty) {
        throw new NotFoundException(`Could not create new property`);
      }
      const oPropertyType = await this.PropertyTypesModel.findOne({
        _id: newProperty.propertyType,
      }).lean();
      const updateImageMeta = imagesMeta.map((obj) =>
        Object.assign({}, obj, { propertyId: newProperty._id }),
      );
      await this.savePropertyDocumentsMetaData(updateImageMeta);
      //console.log(JSON.stringify(newProperty));

      const searchableDocument = this._constructDocument(
        newProperty,
        oAddLocationData,
        oPropertyType,
      );
      await this.elasticsearchService.indexDocument(
        'properties',
        newProperty._id.toString(),
        searchableDocument,
      );

      return {
        status: 200,
        data: newProperty,
        message: 'Property added to the list successfully',
      };
    } catch (oError) {
      console.log(oError);
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

  _constructDocument(newProperty, oAddLocationData, oPropertyType) {
    return {
      washroom: newProperty.washrooms,
      bedroom: newProperty.bedrooms,
      area: oAddLocationData?.oLocals.metadata.vicinity,
      building: oAddLocationData?.oLocals.metadata.name,
      price: newProperty.price,
      purpose: newProperty.purpose,
      status: newProperty.status,
      propertyType: oPropertyType?.category,
      completionStatus: newProperty.completionStatus,
      publishedAt: newProperty.publishedAt,
      squareFeet: newProperty.squareFeet.totalAreaInSquareFeet,
      description: newProperty.description,
      propertyListingTitle: newProperty.title,
    };
  }

  async updatePropertyByAdmin(
    id: string,
    propertyRequests: Partial<UpdatePropertyDto>,
    imagesMeta: any,
  ) {
    try {
      const oExistingProperty = await this.PropertiesModel.findOne({
        _id: id,
        deletedAt: { $eq: null },
      }).lean();

      if (!oExistingProperty) {
        throw new NotFoundException('Property not found');
      }
      //when the client-side is not sending the title field the exisiting slug becomes empty
      //CHECK AND FIX.
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
        //need to do something with building data schema and the id storing in properties schema
        // propertyRequests['buildingData'].location =
        //   oAddLocationData?.locationId.toString();
      }

      const oUpdatedRentalId = await this.updateRentalsData(
        propertyRequests.rentals,
        propertyRequests.rentalId,
      );
      propertyRequests['rental'] = oUpdatedRentalId;

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

      // Push new images into the media.images array if provided
      if (imagesMeta && imagesMeta.length > 0) {
        const updatedImages = await this.PropertiesModel.findOneAndUpdate(
          { _id: id },
          {
            $push: { 'media.images': { $each: propertyRequests.media.images } },
          },
          {
            new: true,
          },
        );
        console.log(updatedImages);
        propertyRequests.media = updatedImages.media;
        //prepare propertyRequest.media.images here so the main update can be done smoothly
      }

      // Remove specific images from the media.images array if provided
      if (
        propertyRequests.removeImages &&
        propertyRequests.removeImages.length > 0
      ) {
        let aExistingValidImages = propertyRequests.removeImages;
        aExistingValidImages = propertyRequests.removeImages.filter((image) =>
          oExistingProperty.media.images.includes(image),
        );

        const removedImages = await this.PropertiesModel.findOneAndUpdate(
          { _id: id },
          { $pull: { 'media.images': { $in: aExistingValidImages } } },
          {
            new: true,
          },
        );
        console.log(removedImages);
        propertyRequests.media = removedImages.media;
        //prepare propertyRequest.media.images here so the main update can be done smoothly
      }

      const oUpdateProperty = await this.PropertiesModel.findByIdAndUpdate(
        id,
        { $set: propertyRequests },
        { new: true },
      );
      if (!oUpdateProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      //feels like some condition is missing for some situations on saving metadata.Check that
      if (imagesMeta && imagesMeta.length > 0) {
        const updateImageMeta = imagesMeta.map((obj) =>
          Object.assign({}, obj, { propertyId: oUpdateProperty._id }),
        );
        await this.savePropertyDocumentsMetaData(updateImageMeta);
      }

      await this.elasticsearchService.updateDocument(
        'properties',
        id,
        propertyRequests,
      );

      return {
        status: 200,
        data: oUpdateProperty,
        message: 'Property details updated successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async getAllPropertyLists(admin: any) {
    try {
      const pipeline = [
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              listingOwner: new mongoose.Schema.Types.ObjectId(
                '670e77b8d6a3256add21c73c',
              ),
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
              from: 'propertytypes',
              localField: 'propertyType',
              foreignField: '_id',
              as: 'propertyTypes',
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
              path: '$propertyTypes',
              preserveNullAndEmptyArrays: true,
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              title: 1,
              propertyType: '$propertyTypes.parentType',
              category: '$propertyTypes.category',
              bedrooms: 1,
              squareFeet: {
                $toInt: '$squareFeet.totalAreaInSquareFeet',
              },
              address: 1,
              referenceNo: 1,
              status: 1,
              permitNumber: 1,
              updatedAt: 1,
              listedOwner: admin?.fullname,
            },
        },
      ];
      const aPropertyLists = await this.PropertiesModel.aggregate(pipeline);
      return {
        status: 200,
        data: aPropertyLists,
        message: 'Property retrieved successfully',
      };
    } catch (oError) {
      throw new RpcException(oError);
    }
  }

  async getPropertiesById(id: string) {
    try {
      const pipeline = [
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              _id: new mongoose.Types.ObjectId(id),
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
              from: 'propertytypes',
              localField: 'propertyType',
              foreignField: '_id',
              as: 'propertyTypes',
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
              path: '$propertyTypes',
              preserveNullAndEmptyArrays: true,
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
              from: 'rentals',
              localField: 'rental',
              foreignField: '_id',
              as: 'rentalDetails',
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
              path: '$rentalDetails',
              preserveNullAndEmptyArrays: true,
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
              from: 'locations',
              localField: 'location',
              foreignField: '_id',
              as: 'locationMeta',
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
              path: '$locationMeta',
              preserveNullAndEmptyArrays: true,
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
              path: '$amenities',
              preserveNullAndEmptyArrays: true,
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
              from: 'amenities',
              localField: 'amenities.amenitiesSelected',
              foreignField: '_id',
              as: 'amenitiesFull',
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
              path: '$amenitiesFull',
              preserveNullAndEmptyArrays: true,
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
              path: '$amenities.options',
              preserveNullAndEmptyArrays: true,
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
              from: 'amenities',
              localField: 'amenities.options.amenitiesOptionSelected',
              foreignField: 'options._id',
              as: 'optionsFull',
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
              path: '$optionsFull',
              preserveNullAndEmptyArrays: true,
            },
        },
        {
          $addFields:
            /**
             * newField: The new field name.
             * expression: The new field expression.
             */
            {
              'amenities.fullData': '$amenitiesFull',
              'amenities.options.fullData': '$optionsFull',
            },
        },
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: '$_id',
              amenities: {
                $push: '$amenities',
              },
              propertyTypes: {
                $first: '$propertyTypes',
              },
              title: {
                $first: '$title',
              },
              titleDeed: {
                $first: '$titleDeed',
              },
              titleArabic: {
                $first: '$titleArabic',
              },
              slug: {
                $first: '$slug',
              },
              description: {
                $first: '$description',
              },
              descriptionArabic: {
                $first: '$descriptionArabic',
              },
              purpose: {
                $first: '$purpose',
              },
              ownershipStatus: {
                $first: '$ownershipStatus',
              },
              ownershipNationality: {
                $first: '$ownershipNationality',
              },
              tenancyForYears: {
                $first: '$tenancyForYears',
              },
              completionStatus: {
                $first: '$completionStatus',
              },
              offplanSaleType: {
                $first: '$offplanSaleType',
              },
              financingAvailability: {
                $first: '$financingAvailability',
              },
              financingInstitute: {
                $first: '$financingInstitute',
              },
              rentalDetails: {
                $first: '$rentalDetails',
              },
              referenceNo: {
                $first: '$referenceNo',
              },
              squareFeet: {
                $first: '$squareFeet',
              },
              serviceCharge: {
                $first: '$serviceCharge',
              },
              locationMeta: {
                $first: '$locationMeta',
              },
              status: {
                $first: '$status',
              },
              reviewStatus: {
                $first: '$reviewStatus',
              },
              availability: {
                $first: '$availability',
              },
              unavailabliltyReason: {
                $first: '$unavailabliltyReason',
              },
              availableDate: {
                $first: '$availableDate',
              },
              publishStatus: {
                $first: '$publishStatus',
              },
              publishedAt: {
                $first: '$publishedAt',
              },
              bedrooms: {
                $first: '$bedrooms',
              },
              parkingSlots: {
                $first: '$parkingSlots',
              },
              isFurnished: {
                $first: '$isFurnished',
              },
              washrooms: {
                $first: '$washrooms',
              },
              hasBalcony: {
                $first: '$hasBalcony',
              },
              hasAttachedBathroom: {
                $first: '$hasAttachedBathroom',
              },
              price: {
                $first: '$price',
              },
              currency: {
                $first: '$currency',
              },
              tenancyWayOfPayments: {
                $first: '$tenancyWayOfPayments',
              },
              developer: {
                $first: '$developer',
              },
              paymentPlan: {
                $first: '$paymentPlan',
              },
              paymentOptions: {
                $first: '$paymentOptions',
              },
              projectTimeline: {
                $first: '$projectTimeline',
              },
              handoverDate: {
                $first: '$handoverDate',
              },
              permitType: {
                $first: '$permitType',
              },
              permitNumber: {
                $first: '$permitNumber',
              },
              media: {
                $first: '$media',
              },
              floorPlan: {
                $first: '$floorPlan',
              },
              listingOwner: {
                $first: '$listingOwner',
              },
              deletedAt: {
                $first: '$deletedAt',
              },
              paidBy: {
                $first: '$paidBy',
              },
              createdAt: {
                $first: '$createdAt',
              },
              updatedAt: {
                $first: '$updatedAt',
              },
            },
        },
      ];
      const aProperty = await this.PropertiesModel.aggregate(pipeline);
      if (!aProperty || aProperty.length === 0) {
        throw new NotFoundException('Property not found');
      }
      return {
        status: 200,
        data: aProperty[0],
        message: `${aProperty[0]['title']} Property retrieved successfully`,
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
      await this.elasticsearchService.deleteDocument(
        'properties',
        id.toString(),
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
    size: number,
  ): Promise<any> {
    const searchQuery = {
      query: { bool: { must: [], filter: {} } },
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
      maxprice,
    );

    return {
      status: 200,
      data: await this.elasticsearchService.search(
        searchQuery,
        from,
        size,
        'properties',
      ),
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
    minprice = '0',
    maxprice = '5000000',
  ) {
    if (query) {
      searchQuery.query.bool.must.push({
        multi_match: {
          query,
          fields: ['area', 'building'],
        },
      });
    }

    if (bedroom) {
      searchQuery.query.bool.must.push({
        match: {
          bedrooms: bedroom,
        },
      });
    }

    if (washroom) {
      searchQuery.query.bool.must.push({
        match: {
          washrooms: washroom,
        },
      });
    }

    if (purpose) {
      searchQuery.query.bool.must.push({
        match: {
          purpose: purpose,
        },
      });
    }

    if (status) {
      searchQuery.query.bool.must.push({
        match: {
          status: status,
        },
      });
    }

    if (propertyType) {
      searchQuery.query.bool.must.push({
        match: {
          propertyType: propertyType,
        },
      });
    }

    if (completionStatus) {
      searchQuery.query.bool.must.push({
        match: {
          completionStatus: completionStatus,
        },
      });
    }

    searchQuery.query.bool.filter = {
      range: {
        price: {
          gte: minprice,
          lte: maxprice,
        },
      },
    };
  }
}
