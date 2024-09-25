import {
  IsString,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

class GeometryDTO {
  @IsString()
  type: string;

  @IsObject()
  @Type(() => GeometryDTO)
  @ValidateNested()
  coordinates: PointDto;
}

class ViewportDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => PointDto)
  topLeft: PointDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PointDto)
  bottomRight: PointDto;
}

export class CoordinatesDTO {
  @IsObject()
  @Type(() => GeometryDTO)
  @ValidateNested()
  geometry?: GeometryDTO;

  @IsObject()
  @Type(() => ViewportDTO)
  @ValidateNested()
  viewport?: ViewportDTO;

  @IsOptional()
  metadata?: any;

  @IsObject()
  @IsOptional()
  links?: object;
}
