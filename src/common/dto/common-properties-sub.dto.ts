import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PaymentStagesDTO {
  @IsString()
  @IsOptional()
  paymentStage: string;

  @IsNumber()
  @IsOptional()
  percentage: number;
}

class TimelineDTO {
  @IsString()
  @IsOptional()
  event: string;

  @Type(() => Date)
  @IsOptional()
  date: Date;
}

export class PaymentPlanDTO {
  @IsArray()
  @IsOptional()
  @Type(() => PaymentStagesDTO)
  @ValidateNested({ each: true })
  stages: PaymentStagesDTO[];

  @IsBoolean()
  @IsOptional()
  usePredefined: boolean;
}

export class ProjectTimelineDTO {
  @IsArray()
  @IsOptional()
  @Type(() => TimelineDTO)
  @ValidateNested({ each: true })
  timelines: TimelineDTO[];

  @IsBoolean()
  @IsOptional()
  usePredefined: boolean;
}
