import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsMongoId,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SUB_CATEGORY } from '../enums/category.enum';
import { PROPERTY_LISTING_STATUS } from '../enums/properties.enum';
import { AmenitiesDTO } from '@/src/common/dto/amenities.dto';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';

export class PropertyBuilderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}

export enum FREQUENCY {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum CategoryType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
}

export enum SubCategory {
  APPARTMENT = 'APPARTMENT',
  VILLA = 'VILLA',
}

export enum Purpose {
  BUY = 'BUY',
  RENT = 'RENT',
}

interface LangCode {
  en: string;
  ar: string;
}

class Rental {
  @IsEnum(FREQUENCY)
  @IsNotEmpty()
  frequency: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  vacatingNoticePeriod?: number;

  @IsOptional()
  @IsNumber()
  maintenanceFee?: number;

  @IsOptional()
  paidBy?: string;

  @IsOptional()
  @IsNumber()
  minimumContract?: number;
}

export class CreatePropertyDto {
  @IsEnum(CategoryType)
  @IsNotEmpty()
  category: string;

  @IsEnum(SUB_CATEGORY)
  @IsNotEmpty()
  subCategory: string;

  @IsEnum(Purpose)
  @IsNotEmpty()
  purpose?: string;

  @IsString()
  @IsNotEmpty()
  title: LangCode;

  @IsString()
  @IsNotEmpty()
  referanceNumber: string;

  @IsOptional()
  @IsNumber()
  sizeInSqFeet?: number;

  @IsString()
  @IsNotEmpty()
  permitNumber: string;

  @IsBoolean()
  @IsOptional()
  autoRenewable: boolean;

  @IsDate()
  @IsOptional()
  renewableDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PROPERTY_LISTING_STATUS)
  status: string;

  @IsNumber()
  bedroom?: number;

  @IsNumber()
  washroom?: number;

  @IsBoolean()
  @IsOptional()
  isFurnished: boolean;

  @IsOptional()
  @IsNumber()
  unitNumber?: number;

  @IsString()
  @IsNotEmpty()
  description: LangCode;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsMongoId()
  @IsNotEmpty()
  subCategoryId: string;

  @IsDate()
  @IsNotEmpty()
  expiryDate: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AmenitiesDTO) // Validate the array of amenities
  @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
  amenities: AmenitiesDTO[];

  @IsMongoId()
  @IsNotEmpty()
  developerId: string;

  @IsDate()
  @IsNotEmpty()
  handoverDate: Date;

  @IsMongoId()
  @IsNotEmpty()
  listingOwnerId: string;

  @IsNotEmpty()
  listingOwner: string;

  @IsNotEmpty()
  rental: Rental;

  @IsMongoId()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsBoolean()
  isForRent?: boolean;

  @IsOptional()
  @IsBoolean()
  isForSale?: boolean;

  @IsOptional()
  @IsNumber()
  pricePerSqFt?: number;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  postedDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @IsNumber()
  parkingSlots?: number;

  @IsOptional()
  @IsString()
  floorPlanLink?: string;

  @IsOptional()
  @IsString()
  brochureLink?: string;
}

export class AddNewAddressDetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsMongoId()
  parent?: string;
}
