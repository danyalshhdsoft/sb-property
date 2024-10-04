import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Documents } from '@/src/common/schemas/documents.schema';
import {
  PROPERTY_RENTAL_FREQUENCY,
  // PROPERTY_RENTAL_ROOM_TYPE,
  PROPERTY_RESIDENCE_TYPES,
  PROPERTY_OCCUPANCY_OPTION,
} from '../enums/properties.enum';
import { TenantEligibility } from '../interface/property-schema.interface';
@Schema({ timestamps: true })
export class Rentals extends Document {
  @Prop({
    type: String,
    enum: PROPERTY_RENTAL_FREQUENCY,
    default: PROPERTY_RENTAL_FREQUENCY.MONTHLY,
  })
  rentalFrequency: PROPERTY_RENTAL_FREQUENCY;
  @Prop({
    type: String,
    enum: PROPERTY_RESIDENCE_TYPES,
    default: PROPERTY_RESIDENCE_TYPES.FAMILY,
  })
  residenceType: PROPERTY_RESIDENCE_TYPES;
  @Prop({
    type: Number,
    default: 0,
  })
  rentalPrice: number;
  @Prop({
    type: Number,
    default: 0,
  })
  vacatingNoticePeriod: number; //in days
  @Prop({
    type: Date,
    default: null,
  })
  startDate: Date;
  // @Prop({
  //   type: Date,
  //   default: null,
  // })
  // endDate: Date;
  @Prop({
    type: String,
    default: '',
  })
  totalRentalPeriod: string;
  @Prop({
    type: Number,
    default: 0,
  })
  maintainanceFee: number;
  @Prop({
    type: Boolean,
    default: 0,
  })
  isNegotiable: boolean;
  @Prop({
    type: String,
    default: '',
  })
  minimumContract: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Documents.name }],
    default: [],
  })
  rentalDocuments: mongoose.Schema.Types.ObjectId[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Properties',
  })
  propertyId: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: Number,
    default: 0,
  })
  securityDeposit: number;
  @Prop({
    type: Number,
    default: 0,
  })
  numberOfTenant: number;
  @Prop({
    type: String,
    default: '', //Male/Female/Other
  })
  preferredTenant: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  balcony: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  attachedBathroom: boolean;
  //
  // @Prop({
  //   type: String,
  //   enum: PROPERTY_RENTAL_ROOM_TYPE,
  //   default: PROPERTY_RENTAL_ROOM_TYPE.PRIVATE_ROOM,
  // })
  // rentalRoomType: PROPERTY_RENTAL_ROOM_TYPE;
  @Prop({
    type: Boolean,
    default: false,
  })
  tenantEligibility: boolean;
  @Prop({
    type: Object,
    default: {},
  })
  tenantEligibilityPreference: TenantEligibility;
  @Prop({
    type: String,
    enum: PROPERTY_OCCUPANCY_OPTION,
    default: PROPERTY_OCCUPANCY_OPTION.VACANT,
  })
  occupancyOption: PROPERTY_OCCUPANCY_OPTION;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const RentalsSchema = SchemaFactory.createForClass(Rentals);
