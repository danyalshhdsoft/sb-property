import { IsNumber, IsString, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUniqueSlug } from './validator/is-unique-slug.validator';

export class HealthAndFitnessFeaturesAttributesDTO {
  @IsBoolean()
  value: boolean;

  @IsString()
  icon: string;
}

export class HealthAndFitnessFeaturesDTO {
  @ValidateNested()
  @Type(() => HealthAndFitnessFeaturesAttributesDTO)
  swimmingPool: HealthAndFitnessFeaturesAttributesDTO;

  @ValidateNested()
  @Type(() => HealthAndFitnessFeaturesAttributesDTO)
  jaccuzi: HealthAndFitnessFeaturesAttributesDTO;
}

export class HealthAndFitnessDTO {
  @ValidateNested()
  @Type(() => HealthAndFitnessFeaturesDTO)
  features: HealthAndFitnessFeaturesDTO;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  title: string;

  @IsString()
  slug: string;
}

export class MiscellaneousFeaturesDTO {
  @IsString()
  view: string;

  @IsNumber()
  floorno: number;

  @IsBoolean()
  petPolicy: boolean;

  @IsNumber()
  area: number;

  @IsNumber()
  numberOfSwimmingPools: number;

  @IsNumber()
  numberOfElevators: number;
}

export class MiscellaneousDTO {
  @ValidateNested()
  @Type(() => MiscellaneousFeaturesDTO)
  features: MiscellaneousFeaturesDTO;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  title: string;

  @IsString()
  @IsUniqueSlug({ message: 'Duplicate slug values are not allowed' })
  slug: string;
}

export class AmenitiesDTO {
  @ValidateNested()
  @Type(() => HealthAndFitnessDTO)
  healthAndFitness: HealthAndFitnessDTO;

  @ValidateNested()
  @Type(() => MiscellaneousDTO)
  miscellaneous: MiscellaneousDTO;

  // Add index signature to allow dynamic fields
  //Addind dynamic amenities are untested.
  [key: string]: any;
}
