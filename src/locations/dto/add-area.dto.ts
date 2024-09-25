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
import { AddCityDTO, UpdateCityDTO } from './add-city.dto';
import { Type } from 'class-transformer';
import { CoordinatesDTO } from './add-coordinates.dto';

export class AddLocalAreaDTO {
  @IsString()
  @IsNotEmpty()
  local?: string;

  @IsArray()
  @ArrayNotEmpty()
  subLocalities?: string[];

  @IsObject()
  @Type(() => AddCityDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  city?: AddCityDTO;

  metadata?: any;

  @IsObject()
  @Type(() => CoordinatesDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  coordinates?: CoordinatesDTO;

  @IsString()
  @IsNotEmpty()
  slug?: string;
}

export class UpdateLocalAreaDTO {
  @IsOptional()
  @IsString()
  local?: string;

  @IsArray()
  @ArrayNotEmpty()
  subLocalities: string[];

  @IsOptional()
  @IsObject()
  @Type(() => UpdateCityDTO)
  @ValidateNested()
  city?: UpdateCityDTO;

  metadata?: any;

  @IsOptional()
  @IsObject()
  @Type(() => CoordinatesDTO)
  @ValidateNested()
  coordinates?: CoordinatesDTO;

  @IsString()
  @IsOptional()
  slug?: string;
}
