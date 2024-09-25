import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateDeveloperDTO {
  @IsString()
  @IsOptional()
  developerName?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsArray()
  @IsOptional()
  documents?: string[];

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  deletedAt?: Date;
}
