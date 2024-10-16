import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
  ArrayNotEmpty,
  IsEnum,
  // ArrayUnique,
  // ValidateNested,
  IsObject,
  IsBoolean,
  ValidateNested,
  IsDate,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

import { STATUS } from '@/src/common/enums/global.enum';
import { CATEGORY, SUB_CATEGORY } from '../../common/enums/category.enum';
import { AmenitiesDTO } from '@/src/amenities/dto/amenities.dto';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';
import {
  PROPERTY_OCCUPANCY_OPTION,
  PROPERTY_PREFERRED_TENANT,
  PROPERTY_RENTAL_FREQUENCY,
  PROPERTY_RESIDENCE_TYPES,
} from '../enums/properties.enum';
import { Types } from 'mongoose';
// import { AmenitiesOptions } from '@/src/common/interfaces/amenities-options.interface';

export interface SquareFeet {
  areaInSquareMeters: number;
  areaInSquareYards: number;
  totalAreaInSquareFeet: number;
  pricePerSquareFeet: number;
}

export class SubCategoryDTO {
  @IsEnum(SUB_CATEGORY)
  @IsString()
  @IsNotEmpty()
  categoryType: string;

  @IsBoolean()
  @IsOptional()
  hasBed: boolean;

  @IsBoolean()
  @IsOptional()
  hasFurnishingStatus: boolean;

  @IsBoolean()
  @IsOptional()
  hasPropertyAge: boolean;

  @IsBoolean()
  @IsOptional()
  hasRoomTypes: boolean;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsObject()
  @IsOptional()
  otherDetails: object;
}

export class BuildingDTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(CATEGORY)
  category: string;

  @IsObject()
  @Type(() => SubCategoryDTO)
  @ValidateNested()
  subCategory: SubCategoryDTO;

  @IsString()
  @IsNotEmpty()
  buildingName: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsNumber()
  @IsOptional()
  yearOfCompletion: number;

  @IsNumber()
  @IsOptional()
  totalFloors: number;

  @IsNumber()
  @IsOptional()
  totalRetailCenters: number;

  @IsNumber()
  @IsOptional()
  totalParkingSlots: number;

  @IsNumber()
  @IsOptional()
  totalBuildingArea: number;

  @IsNumber()
  @IsOptional()
  totalElevators: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'building documents should not be empty' })
  @IsMongoId({
    each: true,
    message: 'Each building document ID must be a valid MongoDB ObjectId',
  })
  buildingDocuments: string[];

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  location: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AmenitiesDTO) // Validate the array of amenities
  @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
  amenities: AmenitiesDTO[];

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  developerId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(STATUS)
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  listingOwner: string; //AgentId/AdminId
}

export class RentalsSchemaDTO {
  @IsOptional()
  @IsString()
  @IsEnum(PROPERTY_RENTAL_FREQUENCY)
  rentalFrequency?: string;

  @IsOptional()
  @IsString()
  @IsEnum(PROPERTY_RESIDENCE_TYPES)
  residenceType?: string;

  @IsNumber()
  @IsOptional()
  rentalPrice?: number;

  @IsNumber()
  @IsOptional()
  vacatingNoticePeriod?: number;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsString()
  @IsOptional()
  totalRentalPeriod?: string;

  @IsNumber()
  @IsOptional()
  maintainanceFee?: number;

  @IsBoolean()
  @IsOptional()
  isNegotiable?: boolean;

  @IsString()
  @IsOptional()
  minimumContract?: string;

  @IsNumber()
  @IsOptional()
  securityDeposit?: number;

  @IsNumber()
  @IsOptional()
  numberOfTenant?: number;

  @IsOptional()
  @IsString()
  @IsEnum(PROPERTY_PREFERRED_TENANT)
  preferredTenant?: string;

  @IsBoolean()
  @IsOptional()
  tenantEligibility?: boolean;

  @IsObject()
  @IsOptional()
  tenantEligibilityPreference?: object;

  @IsOptional()
  @IsString()
  @IsEnum(PROPERTY_OCCUPANCY_OPTION)
  occupancyOption?: string;
}
class AmenitiesOptionsDTO {
  @IsString()
  @IsMongoId()
  amenitiesOptionSelected: Types.ObjectId;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  component: string;

  @IsOptional()
  type: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsOptional()
  value: any;

  @IsOptional()
  @IsBoolean()
  multipleSelection: boolean;

  @IsOptional()
  @IsBoolean()
  display: boolean;

  @IsOptional()
  @IsBoolean()
  required: boolean;
}
export class AmenitiesSchemaDTO {
  @IsString()
  @IsMongoId()
  amenitiesSelected: Types.ObjectId;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsBoolean()
  display?: boolean;

  @IsOptional()
  @IsArray()
  options?: AmenitiesOptionsDTO[];
}

//Needs a discussion to integrate floorplan.
//For now this is optional as the structure is not confirmed.
export class FloorPlansImagesDTO {
  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  image2ds: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  image3ds: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  videos: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  others: string[];
}
