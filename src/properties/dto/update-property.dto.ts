import {
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsMongoId,
  IsEnum,
  IsObject,
  ValidateNested,
  Min,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PROPERTY_AVAILABILITY_STATUS,
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_FINANCING_AVAILABLE,
  PROPERTY_OFF_PLAN_SALE_TYPE,
  PROPERTY_OWNERSHIP_NATIONALITY,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PAID_BY,
  PROPERTY_PERMIT_TYPE,
  PROPERTY_PUBLISH_STATUS,
  PROPERTY_PURPOSE,
  PROPERTY_TENANCY_WAY_OF_PAYMENT,
} from '../enums/properties.enum';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import {
  AmenitiesSchemaDTO,
  // FloorPlansImagesDTO,
  RentalsSchemaDTO,
} from './property-schema-sub.dto';

class PropertyDocument {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  imageUrl?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  image360Url?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  videoLinksUrl?: string[];
}

// class LegalDocuments {
//   @IsMongoId()
//   @IsString()
//   @IsOptional()
//   propertyLicense?: string;

//   @IsString()
//   @IsUrl({}, { message: 'Given URL is not valid' })
//   @IsOptional()
//   documentUrl?: string;
// }
class PaymentPlanDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  percentage?: number;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsNumber()
  serial?: number;
}

class ProjectTimelineDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsNumber()
  serial?: number;
}
export class UpdatePropertyDto {
  @IsMongoId()
  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  titleDeed?: string;

  @IsString()
  @IsOptional()
  titleArabic?: string;

  @IsString()
  @IsOptional()
  // @MinLength(10, {
  //   message: 'Description is too short',
  // })
  // @MaxLength(50, {
  //   message: 'Description is too long',
  // })
  description?: string;

  @IsString()
  @IsOptional()
  descriptionArabic?: string;

  @IsString()
  @IsOptional()
  @IsEnum(PROPERTY_PURPOSE)
  purpose?: PROPERTY_PURPOSE;

  @IsString()
  @IsEnum(PROPERTY_OWNERSHIP_STATUS)
  @IsOptional()
  ownershipStatus?: PROPERTY_OWNERSHIP_STATUS; //can be empty string?

  @IsString()
  @IsEnum(PROPERTY_OWNERSHIP_NATIONALITY)
  @IsOptional()
  ownershipNationality?: PROPERTY_OWNERSHIP_NATIONALITY;

  @IsString()
  @IsOptional()
  tenancyForYears?: string;

  @IsString()
  @IsOptional()
  @IsEnum(PROPERTY_COMPLETION_STATUS)
  completionStatus?: PROPERTY_COMPLETION_STATUS;

  @IsString()
  @IsEnum(PROPERTY_OFF_PLAN_SALE_TYPE)
  @IsOptional()
  offplanSaleType?: PROPERTY_OFF_PLAN_SALE_TYPE;

  @IsString()
  @IsEnum(PROPERTY_FINANCING_AVAILABLE)
  @IsOptional()
  financingAvailability?: PROPERTY_FINANCING_AVAILABLE;

  @IsString()
  @IsOptional()
  financingInstitute?: string;

  @IsObject()
  @Type(() => RentalsSchemaDTO)
  @ValidateNested()
  @IsOptional()
  rentals?: RentalsSchemaDTO;

  @IsOptional()
  @IsString()
  rentalId?: string;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  totalAreaInSquareFeet?: number;

  @IsOptional()
  @IsNumber()
  pricePerSquareFeet?: number;

  @IsOptional()
  @IsNumber()
  serviceCharge?: number;

  @IsOptional()
  locationMetaData?: any;

  @IsString()
  @IsOptional()
  placeId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @IsEnum(PROPERTY_AVAILABILITY_STATUS)
  @IsOptional()
  availability?: PROPERTY_AVAILABILITY_STATUS;

  @IsString()
  @IsOptional()
  unavailabliltyReason?: string;

  @IsDate()
  @IsOptional()
  availableDate?: Date;

  @IsString()
  @IsOptional()
  @IsEnum(PROPERTY_AVAILABILITY_STATUS)
  publishStatus?: PROPERTY_PUBLISH_STATUS;

  // publishedAt: Date;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  parkingSlots?: number;

  @IsOptional()
  @IsBoolean()
  isFurnished?: boolean;

  @IsOptional()
  @IsNumber()
  washrooms?: number;

  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAttachedBathroom: boolean;

  @IsArray()
  @Type(() => AmenitiesSchemaDTO)
  @ValidateNested({ each: true })
  @IsOptional()
  amenities?: AmenitiesSchemaDTO[];

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(PROPERTY_TENANCY_WAY_OF_PAYMENT, { each: true })
  tenancyWayOfPayments?: PROPERTY_TENANCY_WAY_OF_PAYMENT[];

  @IsOptional()
  @IsString()
  @IsMongoId()
  developer?: string;

  @IsOptional()
  @IsArray()
  @Type(() => PaymentPlanDTO)
  @ValidateNested({ each: true })
  paymentPlan?: PaymentPlanDTO[];

  @IsOptional()
  @IsString({ each: true })
  @IsEnum(PAYMENT_OPTIONS, { each: true })
  paymentOptions?: PAYMENT_OPTIONS[];

  @IsOptional()
  @IsArray()
  @Type(() => ProjectTimelineDTO)
  @ValidateNested({ each: true })
  projectTimeline?: ProjectTimelineDTO[];

  @IsOptional()
  @IsDate()
  handoverDate?: Date;

  @IsOptional()
  @IsString()
  @IsEnum(PROPERTY_PERMIT_TYPE)
  permitType?: PROPERTY_PERMIT_TYPE;

  @IsOptional()
  @IsNumber()
  permitNumber?: number;

  @IsOptional()
  @IsObject()
  @Type(() => PropertyDocument)
  @ValidateNested()
  media?: PropertyDocument;

  // @IsArray()
  // @IsOptional()
  // @IsMongoId({ each: true })
  // licenseType?: string[];

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // @IsUrl({}, { each: true })
  // legaldocuments?: LegalDocuments[];

  //Needs a discussion to integrate floorplan.
  //For now this is optional as the structure is not confirmed.
  // @IsOptional()
  // @IsObject()
  // @Type(() => FloorPlansImagesDTO)
  // @ValidateNested()
  // floorPlans?: FloorPlansImagesDTO;

  @IsOptional()
  @IsEnum(PROPERTY_PAID_BY)
  @IsString()
  paidBy?: string;
}
