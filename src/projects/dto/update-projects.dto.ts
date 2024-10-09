import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  PROJECT_DOCUMENT_STATUS,
  PROJECT_STATUS,
} from '../enums/projects.enum';
import { AmenitiesDTO } from '@/src/amenities/dto/amenities.dto';
import { Type } from 'class-transformer';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';
import { BuildingDTO } from '@/src/properties/dto/property-schema-sub.dto';

export class UpdateProjectDTO {
  @IsString()
  @IsOptional()
  projectTitle?: string;

  @IsNumber()
  @IsOptional()
  priceFrom?: number;

  @IsString()
  @IsOptional()
  developerId?: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  location?: string;

  @IsString()
  @IsOptional()
  @IsEnum(PAYMENT_OPTIONS)
  paymentOptions?: string;

  @IsOptional()
  paymentPlan?: object;

  @IsString()
  @IsOptional()
  pitchInterstedParties?: string;

  @IsString()
  @IsOptional()
  aboutLocation?: string;

  @IsString()
  @IsOptional()
  aboutProject?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AmenitiesDTO) // Validate the array of amenities
  @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
  amenities: AmenitiesDTO[];

  @IsString()
  @IsEnum(PROJECT_STATUS)
  @IsOptional()
  projectStatus?: string;

  @IsString()
  @IsEnum(PROJECT_DOCUMENT_STATUS)
  @IsOptional()
  documentStatus?: string;

  @IsArray()
  @IsOptional()
  documents?: string[];

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsOptional()
  listedTimeStamp?: Date;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  deletedAt?: Date;

  @IsObject()
  @Type(() => BuildingDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  buildingData: BuildingDTO;

  locationMetaData: any;

  @IsString()
  @IsNotEmpty()
  placeId?: string;
}
