import {
  IsString,
  IsBoolean,
  IsNumber,
  // IsDate,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
  ArrayNotEmpty,
  // ValidateNested,
} from 'class-validator';
import {
  PROPERTY_PURPOSE,
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_LISTING_STATUS,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PAID_BY,
  PROPERTY_REVIEW_STATUS,
  // PROPERTY_AS_PROJECT_TIMELINE,
} from '../enums/properties.enum';
// import { Type } from 'class-transformer';
import { CATEGORY } from '../../common/enums/category.enum';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import {
  BuildingDTO,
  SquareFeet,
  SubCategoryDTO,
} from './property-schema-sub.dto';
import { Type } from 'class-transformer';
import {
  PaymentPlanDTO,
  ProjectTimelineDTO,
} from '@/src/common/dto/common-properties-sub.dto';
import { AmenitiesDTO } from '@/src/common/dto/amenities.dto';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';
import { AddCityDTO } from '@/src/locations/dto/add-city.dto';
import { AddLocalAreaDTO } from '@/src/locations/dto/add-area.dto';

export class UpdatePropertyDto {
  @IsString()
  @IsEnum(CATEGORY)
  @IsOptional()
  category?: string;

  @IsObject()
  @Type(() => SubCategoryDTO)
  @ValidateNested()
  @IsOptional()
  subCategory?: SubCategoryDTO;

  @IsString()
  @IsEnum(PROPERTY_PURPOSE)
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsEnum(PROPERTY_COMPLETION_STATUS)
  @IsOptional()
  completionStatus?: string;

  @IsString()
  @IsOptional()
  propertyListingTitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @Type(() => AddCityDTO)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  city?: AddCityDTO[];

  @IsArray()
  @Type(() => AddLocalAreaDTO)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  local?: AddLocalAreaDTO[];

  @IsBoolean()
  @IsOptional()
  autoRenewal?: boolean;

  //@IsDate()
  @IsOptional()
  renewalDate?: Date;

  @IsString()
  @IsEnum(PROPERTY_LISTING_STATUS)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  parkingSlots?: number;

  @IsBoolean()
  @IsOptional()
  isFurnished?: boolean;

  @IsNumber()
  @IsOptional()
  washrooms?: number;

  @IsString()
  @IsOptional()
  balcony?: string;

  @IsString()
  @IsEnum(PROPERTY_OWNERSHIP_STATUS)
  @IsOptional()
  ownershipStatus?: string;

  //@IsDate()
  @IsOptional()
  expiryDate?: Date;

  @IsNumber()
  @IsOptional()
  propertyListingPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AmenitiesDTO) // Validate the array of amenities
  @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
  amenities: AmenitiesDTO[];

  @IsString()
  @IsOptional()
  developerId?: string; // Or ObjectId if applicable

  @IsString()
  @IsOptional()
  projectId?: string; // Or ObjectId if applicable

  //@IsDate()
  @IsOptional()
  handoverDate?: Date;

  @IsString()
  @IsOptional()
  @IsEnum(PAYMENT_OPTIONS)
  paymentOptions?: string;

  @IsOptional()
  @IsObject()
  @Type(() => PaymentPlanDTO)
  @ValidateNested()
  paymentPlan?: PaymentPlanDTO;

  @IsOptional()
  @IsObject()
  @Type(() => ProjectTimelineDTO)
  @ValidateNested()
  projectTimeline?: ProjectTimelineDTO;

  //@IsDate()
  @IsOptional()
  listedTimeStamp?: Date;

  //@IsDate()
  @IsOptional()
  createdAt?: Date;

  //@IsDate()
  @IsOptional()
  updatedAt?: Date;

  //@IsDate()
  @IsOptional()
  deletedAt?: Date;

  @IsOptional()
  squareFeet?: SquareFeet;

  @IsNumber()
  @IsOptional()
  serviceCharge?: number;

  @IsString()
  @IsEnum(PROPERTY_PAID_BY)
  @IsOptional()
  paidBy?: string;

  @IsString()
  @IsOptional()
  rentalId?: string;

  @IsString()
  @IsOptional()
  listingOwner?: string; // Or ObjectId if applicable

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  reviewStatus?: string;

  @IsArray()
  @IsOptional()
  propertyDocuments?: string[]; // Or ObjectId[] if applicable

  @IsArray()
  @IsOptional()
  floorPlans?: string[];

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  occupancyOption?: string;

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  residenceType?: string;

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  availabilityStatus?: string;

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  constructionStatus?: string;

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  verificationService?: string;

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  offplanSaleType?: string;

  @IsString()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  @IsOptional()
  tenancyWayOfPayments?: string;

  @IsOptional()
  @IsObject()
  @Type(() => BuildingDTO)
  @ValidateNested()
  buildingData?: BuildingDTO;

  locationMetaData?: any;

  @IsString()
  @IsNotEmpty()
  placeId?: string;
}
