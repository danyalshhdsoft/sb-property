import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import {
  ArrayNotEmpty,
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
import { Type } from 'class-transformer';
import { AmenitiesDTO } from '@/src/common/dto/amenities.dto';
import { IsUniqueSlug } from '@/src/common/dto/validator/is-unique-slug.validator';
import { BuildingDTO } from '@/src/properties/dto/property-schema-sub.dto';

export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty()
  projectTitle: string;

  @IsNumber()
  @IsNotEmpty()
  priceFrom: number;

  @IsString()
  @IsNotEmpty()
  developerId: string;

  @IsString()
  @IsMongoId()
  location: string;

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
  @IsNotEmpty()
  projectStatus: string;

  @IsString()
  @IsEnum(PROJECT_DOCUMENT_STATUS)
  @IsNotEmpty()
  documentStatus: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Property documents should not be empty' })
  @IsMongoId({
    each: true,
    message: 'Each property document ID must be a valid MongoDB ObjectId',
  })
  documents: string[];

  @IsString()
  @IsNotEmpty()
  propertyId: string;

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
  placeId: string;
}
