import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDeveloperDTO {
  @IsString()
  @IsNotEmpty()
  developerName: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Property documents should not be empty' })
  @IsMongoId({
    each: true,
    message: 'Each property document ID must be a valid MongoDB ObjectId',
  })
  documents: string[];

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  deletedAt?: Date;
}
