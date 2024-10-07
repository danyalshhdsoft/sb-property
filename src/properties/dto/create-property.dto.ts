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
  IsObject,
  ValidateNested,
  IsNotEmptyObject,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PROPERTY_AVAILABILITY_STATUS,
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_FINANCING_AVAILABLE,
  PROPERTY_LISTING_STATUS,
  PROPERTY_OFF_PLAN_SALE_TYPE,
  PROPERTY_OWNERSHIP_NATIONALITY,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PAID_BY,
  PROPERTY_PERMIT_TYPE,
  PROPERTY_PUBLISH_STATUS,
  PROPERTY_PURPOSE,
  PROPERTY_REVIEW_STATUS,
  PROPERTY_TENANCY_WAY_OF_PAYMENT,
} from '../enums/properties.enum';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import { RentalsSchemaDTO } from './property-schema-sub.dto';

class PropertyDocument {
  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  imageUrl: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  image360Url: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'URL should not be empty' })
  @IsString({ each: true })
  videoLinksUrl: string[];
}

class PaymentPlanDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  percentage: number;

  @IsOptional()
  @IsString()
  caption: string;

  @IsOptional()
  @IsNumber()
  serial: number;
}

class ProjectTimelineDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  subtitle: string;

  @IsOptional()
  @IsNumber()
  serial: number;
}

class SquareFeetDTO {
  @IsOptional()
  @IsNumber()
  areaInSquareMeters;

  @IsOptional()
  @IsNumber()
  areaInSquareYards;

  @IsNumber()
  @Min(0.01)
  totalAreaInSquareFeet;

  @IsOptional()
  @IsNumber()
  pricePerSquareFeet;
}
export class CreatePropertyDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_PURPOSE)
  purpose: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_COMPLETION_STATUS)
  completionStatus: string;

  financingAvailability: PROPERTY_FINANCING_AVAILABLE;

  financingInstitute: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  titleDeed: string;

  titleArabic: string;

  descriptionArabic: string;

  @IsString()
  @IsNotEmpty()
  // @MinLength(10, {
  //   message: 'Description is too short',
  // })
  // @MaxLength(50, {
  //   message: 'Description is too long',
  // })
  description: string;

  @IsString()
  @IsNotEmpty()
  referenceNo: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_LISTING_STATUS)
  status: string;

  @IsString()
  @IsEnum(PROPERTY_OWNERSHIP_STATUS)
  ownershipStatus: PROPERTY_OWNERSHIP_STATUS; //can be empty string?

  @IsString()
  @IsEnum(PROPERTY_OWNERSHIP_NATIONALITY)
  ownershipNationality: PROPERTY_OWNERSHIP_NATIONALITY;
 
  tenancyForYears: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsOptional()
  @IsString()
  @IsMongoId()
  developer?: string;

  //Rentals
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  listingOwner: string; //AgentId

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_REVIEW_STATUS)
  reviewStatus: string; //pending,approve,rejected

  @IsObject()
  @Type(() => PropertyDocument)
  @ValidateNested()
  media: PropertyDocument;

  licenseType: string[];

  legaldocuments: string[];

  //Optional Felds

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  parkingSlots?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isFurnished?: boolean;

  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean;

  hasAttachedBathroom: boolean;

  @IsOptional()
  @IsNumber()
  washrooms?: number;

  @IsOptional()
  @IsDate()
  handoverDate?: Date;

  permitType: PROPERTY_PERMIT_TYPE;

  permitNumber: number;

  @IsOptional()
  @IsEnum(PROPERTY_PAID_BY)
  paidBy?: string;

  @IsOptional()
  @IsEnum(PAYMENT_OPTIONS)
  paymentOptions?: string;

  @IsOptional()
  @IsArray()
  @Type(() => PaymentPlanDTO)
  @ValidateNested({ each: true })
  paymentPlan?: PaymentPlanDTO[];

  @IsOptional()
  @IsArray()
  @Type(() => ProjectTimelineDTO)
  @ValidateNested({ each: true })
  projectTimeline?: ProjectTimelineDTO[];

  @IsObject()
  @Type(() => SquareFeetDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  squareFeet?: SquareFeetDTO;

  @IsOptional()
  @IsNumber()
  serviceCharge?: number;

  @IsObject()
  @Type(() => RentalsSchemaDTO)
  @ValidateNested()
  rentals?: RentalsSchemaDTO;

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'Each floor plan document ID must be a valid MongoDB ObjectId',
  })
  floorPlans?: string[];

  @IsString()
  @IsEnum(PROPERTY_AVAILABILITY_STATUS)
  availability: string;

  unavailabliltyReason: string;

  availableDate: Date;

  publishStatus: PROPERTY_PUBLISH_STATUS;

  publishedAt: Date;

  @IsString()
  @IsEnum(PROPERTY_OFF_PLAN_SALE_TYPE)
  offplanSaleType: string;

  @IsArray()
  @IsString({ each: true })
  @IsEnum(PROPERTY_TENANCY_WAY_OF_PAYMENT)
  tenancyWayOfPayments: string[];

  locationMetaData: any;

  @IsString()
  @IsNotEmpty()
  placeId: string;
}

//TBD if needed or not?
// @IsOptional()
// @ValidateNested({ each: true })
// @Type(() => AmenitiesDTO) // Validate the array of amenities
// @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
// amenities: AmenitiesDTO[];
