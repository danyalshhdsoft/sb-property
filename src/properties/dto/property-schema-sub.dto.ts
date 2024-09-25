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
} from 'class-validator';
import { Type } from 'class-transformer';

import { STATUS } from '@/src/common/enums/global.enum';
import { CATEGORY, SUB_CATEGORY } from '../enums/category.enum';
import { AmenitiesDTO } from '@/src/common/dto/amenities.dto';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';

export interface AnalyticsCounts {
  buy: number;
  sale: number;
  rent: number;
  totalProperties: number;
}

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
