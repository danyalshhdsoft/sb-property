import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { LicenseCriteria } from '../interface/property-schema.interface';
import { PropertyType } from '@/src/common/schemas/property-type.schema';
import {
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_LICENSE_STATUS,
  PROPERTY_LOCATION_TYPE,
  PROPERTY_PURPOSE,
} from '../enums/properties.enum';

@Schema({ timestamps: true })
export class PropertyLicenses extends Document {
  @Prop({
    required: true,
    type: String,
  })
  license: string;
  @Prop({
    required: true,
    type: String,
  })
  slug: string;
  @Prop({
    required: true,
    type: String,
  })
  description: string;
  @Prop({
    default: {},
  })
  criteria: LicenseCriteria;
  @Prop({
    type: [String],
    default: [],
  })
  exampleDocuments: string[]; //save the meta-data in Documents Schema
  @Prop({
    type: String,
    default: '',
  })
  country: string;
  @Prop({
    type: String,
    default: '',
  })
  city: string;
  @Prop({
    type: String,
    default: '',
  })
  location: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PropertyType.name,
    required: true,
  })
  propertyType: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: String,
    enum: PROPERTY_PURPOSE,
    required: true,
  })
  purpose: PROPERTY_PURPOSE;
  @Prop({
    type: String,
    enum: PROPERTY_COMPLETION_STATUS,
    required: true,
  })
  completionStatus: PROPERTY_COMPLETION_STATUS;
  @Prop({
    type: String,
    enum: PROPERTY_LOCATION_TYPE,
    default: '',
  })
  locationType: PROPERTY_LOCATION_TYPE;
  @Prop({
    required: true,
    type: String,
    enum: PROPERTY_LICENSE_STATUS,
    default: PROPERTY_LICENSE_STATUS.ACTIVE,
  })
  documentStatus: PROPERTY_LICENSE_STATUS;
  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const PropertyLicensesSchema =
  SchemaFactory.createForClass(PropertyLicenses);
