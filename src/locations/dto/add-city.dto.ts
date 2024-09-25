import { CountrySetting } from '@/src/common/util/common.util';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CoordinatesDTO } from './add-coordinates.dto';

export class AddCityDTO {
  @IsString()
  @MaxLength(CountrySetting.ISO_CODE_LENGTH)
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  metadata: any;

  @IsObject()
  @Type(() => CoordinatesDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  coordinates: CoordinatesDTO;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class UpdateCityDTO {
  @IsOptional()
  @IsString()
  @MaxLength(CountrySetting.ISO_CODE_LENGTH)
  country?: string;

  @IsOptional()
  @IsString()
  name?: string;

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
