import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import {
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_LISTING_STATUS,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PAID_BY,
  PROPERTY_PURPOSE,
  PROPERTY_REVIEW_STATUS,
  PROPERTY_OFF_PLAN_SALE_TYPE,
  PROPERTY_TENANCY_WAY_OF_PAYMENT,
  PROPERTY_OWNERSHIP_NATIONALITY,
  PROPERTY_AVAILABILITY_STATUS,
  PROPERTY_PUBLISH_STATUS,
  PROPERTY_FINANCING_AVAILABLE,
  PROPERTY_PERMIT_TYPE,
} from '../enums/properties.enum';

import { Developers } from '@/src/developers/schemas/developers.schema';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import { Locations } from '@/src/locations/schemas/location.schema';

import { Rentals } from './rentals.schema';
import { FloorPlans } from './floor-plans.schema';
import { Buildings } from '@/src/common/schemas/buildings.schema';
import { Cities } from '@/src/locations/schemas/city.schema';
import { Locals } from '@/src/locations/schemas/locals.schema';
import { PropertyType } from '@/src/propertyTypes/schemas/property-type.schema';
import {
  // LegalDocuments,
  PaymentPlan,
  ProjectTimeline,
  PropertyDocument,
  SquareFeet,
} from '../interface/property-schema.interface';
import {
  Amenities,
  AmenitiesSchema,
} from '@/src/amenities/schemas/amenities.schema';
// import { PropertyLicenses } from './property-license.schema';

@Schema({ timestamps: true })
export class Properties extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PropertyType.name,
    required: true,
  })
  propertyType: mongoose.Schema.Types.ObjectId; //prescripted with isActive:true/false and hasFurnishedField:true/false

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    default: '',
  })
  titleDeed: string;

  @Prop({
    type: String,
  })
  titleArabic: string;

  @Prop({ type: String })
  slug: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
  })
  descriptionArabic: string;

  @Prop({
    type: String,
    enum: PROPERTY_PURPOSE,
    required: true,
  })
  purpose: PROPERTY_PURPOSE;

  @Prop({
    type: String,
    enum: PROPERTY_OWNERSHIP_STATUS,
    default: '',
  })
  ownershipStatus: PROPERTY_OWNERSHIP_STATUS;

  @Prop({
    type: String,
    enum: PROPERTY_OWNERSHIP_NATIONALITY,
    default: '',
  })
  ownershipNationality: PROPERTY_OWNERSHIP_NATIONALITY;

  @Prop({ type: String, default: '' })
  tenancyForYears: string; //lease-hold timeperiod

  @Prop({
    type: String,
    enum: PROPERTY_COMPLETION_STATUS,
    required: true,
  })
  completionStatus: PROPERTY_COMPLETION_STATUS;

  @Prop({
    type: String,
    enum: PROPERTY_OFF_PLAN_SALE_TYPE,
    default: '',
  })
  offplanSaleType: PROPERTY_OFF_PLAN_SALE_TYPE; //when the property is off_plan, sometimes there wont be any owner who bought it so agent can sell this property as intial/re-sale type

  @Prop({
    type: String,
    enum: PROPERTY_FINANCING_AVAILABLE,
    default: '',
  })
  financingAvailability: PROPERTY_FINANCING_AVAILABLE; //only when purpose is sale

  @Prop({
    type: String,
    default: '',
  })
  financingInstitute: string; //only when purpose is sale

  //to fetch rental data on retrieval
  //promise function to save rental info in rentalschema by
  //validating from RentalsSchemaDTO and using in promise call
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Rentals.name })
  rental: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  referenceNo: string;

  //not from client-side
  //but to fetch from locationMetaData and save
  //and add the building primary id got from callback of addNewLocation
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Buildings.name })
  building: mongoose.Schema.Types.ObjectId; //keep building

  //from client-request totalAreaInSquareFeet and pricePerSquareFeet will come
  //rest of the data in this object calculate and save
  //the DTO is going to validate these 2 fields too
  @Prop({
    type: Object,
    default: {},
  })
  squareFeet: SquareFeet;

  @Prop({
    type: Number,
    default: 0,
  })
  serviceCharge: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Locations.name,
    default: null,
  })
  location: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  placeId: string;

  @Prop({
    type: String,
    default: '',
  })
  address: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Cities.name,
    default: null,
  })
  city: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Locals.name,
    default: null,
  })
  locals: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    enum: PROPERTY_LISTING_STATUS,
    default: PROPERTY_LISTING_STATUS.INACTIVE,
  })
  status: PROPERTY_LISTING_STATUS;

  @Prop({
    type: String,
    enum: PROPERTY_REVIEW_STATUS,
    default: PROPERTY_REVIEW_STATUS.PENDING,
  })
  reviewStatus: PROPERTY_REVIEW_STATUS; //pending,approve,rejected

  @Prop({
    type: String,
    enum: PROPERTY_AVAILABILITY_STATUS,
    default: '',
  })
  availability: PROPERTY_AVAILABILITY_STATUS;

  @Prop({
    type: String,
    default: '',
  })
  unavailabliltyReason: string;

  @Prop({ default: null, type: Date })
  availableDate: Date; //when the availability option is AVAILABLE then give this date

  //Agent need to select a status.
  //Each status explained in the enum page ../enums/properties.enum.ts -> PROPERTY_PUBLISH_STATUS
  @Prop({
    type: String,
    enum: PROPERTY_PUBLISH_STATUS,
    required: true,
  })
  publishStatus: PROPERTY_PUBLISH_STATUS;

  @Prop({
    type: Date,
    default: null,
  })
  publishedAt: Date;

  @Prop({
    type: Number,
    default: 0,
  })
  bedrooms: number;

  @Prop({
    type: Number,
    default: 0,
  })
  parkingSlots: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isFurnished: boolean;
  @Prop({
    type: Number,
    default: 0,
  })
  washrooms: number;
  @Prop({
    type: Boolean,
    default: false,
  })
  hasBalcony: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  hasAttachedBathroom: boolean;

  @Prop({ type: [AmenitiesSchema], default: [] })
  amenities: Amenities[];

  @Prop({
    type: Number,
    required: true,
  })
  price: number; //property price

  @Prop({
    type: String,
    default: 'AED',
  })
  currency: string;

  @Prop({
    type: [String],
    enum: PROPERTY_TENANCY_WAY_OF_PAYMENT,
    default: [],
  })
  tenancyWayOfPayments: PROPERTY_TENANCY_WAY_OF_PAYMENT[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Developers.name,
    default: null,
  })
  developer: mongoose.Schema.Types.ObjectId;

  @Prop({
    default: [],
  })
  paymentPlan: PaymentPlan[];

  @Prop({
    type: [String],
    enum: PAYMENT_OPTIONS,
    default: PAYMENT_OPTIONS.INSTALLMENT_SETTLEMENT,
  })
  paymentOptions: PAYMENT_OPTIONS[];

  //TBD
  @Prop({
    default: [], // By default, the payment plan array will be empty
  })
  projectTimeline: ProjectTimeline[];

  @Prop({
    type: Date,
    default: null,
  })
  handoverDate: Date;

  @Prop({
    type: String,
    enum: PROPERTY_PERMIT_TYPE,
    required: true,
  })
  permitType: PROPERTY_PERMIT_TYPE;

  @Prop({
    type: Number,
    default: 0,
  })
  permitNumber: number;

  //documents, propertyimage, video, 360 image needs a field decided
  @Prop({
    type: Object,
    default: () => ({}),
  })
  media: PropertyDocument; //Don't forget to save document meta-data in Document schema
  // @Prop({
  //   type: [
  //     { type: mongoose.Schema.Types.ObjectId, ref: PropertyLicenses.name },
  //   ],
  //   default: [],
  // })
  // licenseType: mongoose.Schema.Types.ObjectId[];

  //working on the structure and flow
  // @Prop({
  //   type: Array,
  //   default: [],
  // })
  // legaldocuments: LegalDocuments[];

  //Needs a discussion to integrate floorplan.
  //For now this is optional as the structure is not confirmed.
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: FloorPlans.name,
    default: null,
  })
  floorPlan: mongoose.Schema.Types.ObjectId; //AgentId

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  })
  listingOwner: mongoose.Schema.Types.ObjectId; //AgentId/AdminId

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  deletedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ default: null, type: Date })
  deletedAt: Date;

  //may need a field to save history of this property purchases(between admin and agents)
  @Prop({
    type: String,
    enum: PROPERTY_PAID_BY,
    default: PROPERTY_PAID_BY.TENANT,
  })
  paidBy: PROPERTY_PAID_BY;

  // @Prop({
  //   type: String,
  //   enum: PROPERTY_VERFICATION_CHECK,
  //   default: PROPERTY_VERFICATION_CHECK.MANUAL,
  // })
  // verificationService: PROPERTY_VERFICATION_CHECK;
}

export const PropertiesSchema = SchemaFactory.createForClass(Properties);
