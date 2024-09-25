import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CoordinatesDTO } from './add-coordinates.dto';
import { Type } from 'class-transformer';
import { AddCityDTO, UpdateCityDTO } from './add-city.dto';
import { AddLocalAreaDTO } from './add-area.dto';

class LocationSlugDTO {
  @IsArray()
  splitValue: string[];

  @IsString()
  slugToDisplay: string;

  @IsString()
  formattedSlug: string;
}
export class AddLocationDTO {
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsObject()
  @Type(() => AddCityDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  city: AddCityDTO;

  @IsArray()
  @Type(() => AddLocalAreaDTO)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  local: AddLocalAreaDTO[];

  metadata: any;

  @IsObject()
  @Type(() => CoordinatesDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  coordinates: CoordinatesDTO;

  @IsObject()
  @Type(() => LocationSlugDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  slug: LocationSlugDTO;

  @IsString()
  @IsOptional()
  module?: string;
}

export class UpdateLocationDTO {
  @IsOptional()
  @IsString()
  placeId?: string;

  @IsOptional()
  @IsObject()
  @Type(() => UpdateCityDTO)
  @ValidateNested()
  city?: UpdateCityDTO;

  @IsOptional()
  @IsArray()
  @Type(() => AddLocalAreaDTO)
  @ValidateNested({ each: true })
  local?: AddLocalAreaDTO[];

  metadata?: any;

  @IsOptional()
  @IsObject()
  @Type(() => CoordinatesDTO)
  @ValidateNested()
  coordinates?: CoordinatesDTO;

  @IsString()
  @IsOptional()
  module?: string;

  @IsString()
  @IsOptional()
  slug?: string;
}
