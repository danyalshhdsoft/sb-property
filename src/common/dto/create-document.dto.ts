import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FileDocumentDTO {
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsNotEmpty()
  module: string;

  @IsString()
  @IsNotEmpty()
  documentFileType: string;

  @IsString()
  @IsNotEmpty()
  documentUrl: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsMongoId()
  @IsOptional()
  propertyId?: string;

  @IsMongoId()
  @IsOptional()
  projectId?: string;

  @IsMongoId()
  @IsOptional()
  floorPlanId?: string;

  @IsMongoId()
  @IsOptional()
  rentalsId?: string;

  @IsMongoId()
  @IsOptional()
  developerId?: string;

  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsMongoId()
  @IsOptional()
  uploadedBy?: string;
}
