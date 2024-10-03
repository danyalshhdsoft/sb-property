import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsMongoId,
  ArrayNotEmpty,
  IsEnum,
  // ArrayUnique,
  // ValidateNested,
  IsObject,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PROPERTY_AVAILABILITY_STATUS,
  // PROPERTY_AS_PROJECT_TIMELINE,
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_CONSTRUCTION_STATUS,
  PROPERTY_LISTING_STATUS,
  PROPERTY_OCCUPANCY_OPTION,
  PROPERTY_OFF_PLAN_SALE_TYPE,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PURPOSE,
  PROPERTY_RESIDENCE_TYPES,
  PROPERTY_REVIEW_STATUS,
  PROPERTY_TENANCY_WAY_OF_PAYMENT,
  PROPERTY_VERFICATION_CHECK,
} from '../enums/properties.enum';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import { CATEGORY } from '../../common/enums/category.enum';
import { BuildingDTO, SubCategoryDTO } from './property-schema-sub.dto';
import {
  PaymentPlanDTO,
  ProjectTimelineDTO,
} from '@/src/common/dto/common-properties-sub.dto';
import { AddCityDTO } from '@/src/locations/dto/add-city.dto';
import { AddLocalAreaDTO } from '@/src/locations/dto/add-area.dto';
import { AmenitiesDTO } from '@/src/common/dto/amenities.dto';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(CATEGORY)
  category: string;

  @IsObject()
  @Type(() => SubCategoryDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  subCategory: SubCategoryDTO;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_PURPOSE)
  purpose: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_COMPLETION_STATUS)
  completionStatus: string;

  @IsString()
  @IsNotEmpty()
  propertyListingTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  referenceNo: string;

  @IsString()
  @IsMongoId()
  location?: string;

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

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_LISTING_STATUS)
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_OWNERSHIP_STATUS)
  ownershipStatus: string;

  @Type(() => Date)
  // @IsDate()
  expiryDate: Date;

  @IsNumber()
  propertyListingPrice: number;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  developerId: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  //Rentals
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  listingOwner: string; //AgentId

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  reviewStatus: string; //pending,approve,rejected

  @IsArray()
  @ArrayNotEmpty({ message: 'Property documents should not be empty' })
  @IsMongoId({
    each: true,
    message: 'Each property document ID must be a valid MongoDB ObjectId',
  })
  propertyDocuments: string[];

  //Optional Felds

  @IsOptional()
  address?: string;

  @IsOptional()
  autoRenewal?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  renewalDate?: Date;

  @IsOptional()
  bedrooms?: number;

  @IsOptional()
  parkingSlots?: number;

  @IsOptional()
  currency?: string;

  @IsOptional()
  isFurnished?: boolean;

  @IsOptional()
  balcony?: boolean;

  @IsOptional()
  washrooms?: number;

  @IsOptional()
  handoverDate?: Date;

  @IsOptional()
  listedTimeStamp?: Date;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  deletedAt?: Date;

  @IsOptional()
  paidBy?: string;

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

  @IsOptional()
  squareFeet?: object;

  @IsOptional()
  @IsNumber()
  serviceCharge?: number;

  @IsString()
  @IsOptional()
  rentalId?: string;

  @IsOptional()
  floorPlans?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AmenitiesDTO) // Validate the array of amenities
  @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
  amenities: AmenitiesDTO[];

  @IsString()
  @IsEnum(PROPERTY_OCCUPANCY_OPTION)
  occupancyOption: string;

  @IsString()
  @IsEnum(PROPERTY_RESIDENCE_TYPES)
  residenceType: string;

  @IsString()
  @IsEnum(PROPERTY_AVAILABILITY_STATUS)
  availabilityStatus: string;

  @IsString()
  @IsEnum(PROPERTY_CONSTRUCTION_STATUS)
  constructionStatus: string;

  @IsString()
  @IsEnum(PROPERTY_VERFICATION_CHECK)
  verificationService: string;

  @IsString()
  @IsEnum(PROPERTY_OFF_PLAN_SALE_TYPE)
  offplanSaleType: string;

  @IsString()
  @IsEnum(PROPERTY_TENANCY_WAY_OF_PAYMENT)
  tenancyWayOfPayments: string;

  @IsObject()
  @Type(() => BuildingDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  buildingData: BuildingDTO;

  locationMetaData: any;

  @IsString()
  @IsNotEmpty()
  placeId: string;
}
