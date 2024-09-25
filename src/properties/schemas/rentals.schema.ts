import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Documents } from '@/src/common/schemas/documents.schema';
import {
  PROPERTY_RENTAL_FREQUENCY,
  PROPERTY_RENTAL_ROOM_TYPE,
} from '../enums/properties.enum';
@Schema({ timestamps: true })
export class Rentals extends Document {
  @Prop({
    type: String,
    enum: PROPERTY_RENTAL_FREQUENCY,
    default: PROPERTY_RENTAL_FREQUENCY.MONTHLY,
  })
  rentalFrequency: PROPERTY_RENTAL_FREQUENCY;
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
  @Prop({
    type: Date,
    default: null,
  })
  endDate: Date;
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
  tenantCount: number;
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
    type: String,
    enum: PROPERTY_RENTAL_ROOM_TYPE,
    default: PROPERTY_RENTAL_ROOM_TYPE.PRIVATE_ROOM,
  })
  rentalRoomType: PROPERTY_RENTAL_ROOM_TYPE;
  @Prop({
    type: {
      isPreferred: { type: Boolean },
      preferredTenantCountry: { type: String },
      preferredTenantCommunity: { type: String },
    },
    default: {
      isPreferred: false,
      preferredTenantCountry: '',
      preferredTenantCommunity: '',
    },
  })
  tenantEligibility: {
    isPreferred: boolean;
    preferredTenantCountry: string;
    preferredTenantCommunity: string;
  };
}

export const RentalsSchema = SchemaFactory.createForClass(Rentals);
