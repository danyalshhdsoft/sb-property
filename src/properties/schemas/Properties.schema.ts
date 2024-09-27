import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

import {
  PROPERTY_COMPLETION_STATUS,
  PROPERTY_LISTING_STATUS,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PAID_BY,
  PROPERTY_PURPOSE,
  PROPERTY_REVIEW_STATUS,
  PROPERTY_AS_PROJECT_TIMELINE,
  PROPERTY_OCCUPANCY_OPTION,
  PROPERTY_RESIDENCE_TYPES,
  PROPERTY_AVAILABILITY_STATUS,
  PROPERTY_CONSTRUCTION_STATUS,
  PROPERTY_VERFICATION_CHECK,
  PROPERTY_OFF_PLAN_SALE_TYPE,
  PROPERTY_TENANCY_WAY_OF_PAYMENT,
} from '../enums/properties.enum';
import { CATEGORY, SUB_CATEGORY } from '../enums/category.enum';

import { Documents } from '@/src/common/schemas/documents.schema';
import { Projects } from '@/src/projects/schemas/projects.schema';
import { Developers } from '@/src/developers/schemas/developers.schema';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import { Locations } from '@/src/locations/schemas/location.schema';
import { Amenities } from '@/src/common/interfaces/amenities.interface';
import { Rentals } from './rentals.schema';
import { FloorPlans } from './floor-plans.schema';
import {
  Buildings,
  BuildingsSchema,
} from '@/src/common/schemas/buildings.schema';
import { Cities, CitiesSchema } from '@/src/locations/schemas/city.schema';
import { Locals, LocalsSchema } from '@/src/locations/schemas/locals.schema';

const SubCategorySchema = new MongooseSchema({
  categoryType: { type: String, enum: SUB_CATEGORY, default: '' },
  hasBed: { type: Boolean, default: false },
  hasFurnishingStatus: { type: Boolean, default: false },
  hasPropertyAge: { type: Boolean, default: false },

  hasRoomTypes: { type: Boolean, default: false },
  // otherDetails: {
  //   unitNo: { type: String, default: '' },
  //   floorNo: { type: Number, default: 0 },
  //   apartmentName: { type: String, default: '' },
  // },
});

// Define SquareFeet schema
const SquareFeetSchema = new MongooseSchema({
  areaInSquareMeters: { type: Number, default: 0 },
  areaInSquareYards: { type: Number, default: 0 },
  totalAreaInSquareFeet: { type: Number, default: 0 },
  pricePerSquareFeet: { type: Number, default: 0 },
});

// Define AnalyticsCounts schema
// const AnalyticsCountsSchema = new MongooseSchema({
//   buy: { type: Number, default: 0 },
//   sale: { type: Number, default: 0 },
//   rent: { type: Number, default: 0 },
//   totalProperties: { type: Number, default: 0 },
// });
@Schema({ timestamps: true })
export class Properties extends Document {
  //Category and subcategory implementation here is Not Monoogse id since this is not collections
  //But a simple and static ENUM Object
  @Prop({
    required: true,
    type: String,
    enum: CATEGORY,
    default: CATEGORY.RESIDENTIAL_PROPERTY_TYPES,
  })
  category: string;

  @Prop({ type: SubCategorySchema, default: () => ({}) })
  subCategory: typeof SubCategorySchema; //discussion needed

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Buildings.name })
  building: mongoose.Schema.Types.ObjectId; //keep building

  @Prop({
    type: String,
    enum: PROPERTY_PURPOSE,
    default: PROPERTY_PURPOSE.SALE,
  })
  purpose: PROPERTY_PURPOSE;
  @Prop({
    type: String,
    enum: PROPERTY_COMPLETION_STATUS,
    default: PROPERTY_COMPLETION_STATUS.READY,
  })
  completionStatus: PROPERTY_COMPLETION_STATUS;
  @Prop({
    type: String,
    required: true,
  })
  propertyListingTitle: string;
  @Prop({
    type: String,
    default: '',
  })
  description: string;
  @Prop({
    type: String,
    required: true,
  })
  referenceNo: string;
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
    type: [CitiesSchema],
  })
  city: Cities; //Should be an Id
  @Prop({
    type: [LocalsSchema],
  })
  local: Locals[]; //Should be an Id or subdocument
  @Prop({
    type: String,
    enum: PROPERTY_LISTING_STATUS,
    default: PROPERTY_LISTING_STATUS.ACTIVE,
  })
  status: PROPERTY_LISTING_STATUS;
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
    type: String,
    enum: PROPERTY_OWNERSHIP_STATUS,
    default: PROPERTY_OWNERSHIP_STATUS.FREE_HOLD,
  })
  ownershipStatus: PROPERTY_OWNERSHIP_STATUS;

  @Prop({
    type: Number,
    default: 0,
  })
  price: number; //property price
  @Prop({
    type: String,
    default: 'AED',
  })
  currency: string;
  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] }) //add few more enum values
  amenities: Amenities[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Developers.name,
    default: null,
  })
  developer: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Projects.name,
    default: null,
  })
  project: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: Date,
    default: null,
  })
  handoverDate: Date;
  @Prop({
    type: [String],
    enum: PAYMENT_OPTIONS,
    default: PAYMENT_OPTIONS.INSTALLMENT_SETTLEMENT,
  })
  paymentOptions: PAYMENT_OPTIONS[];
  //TBD
  @Prop({
    type: {
      stages: [
        {
          paymentStage: { type: String },
          percentage: { type: Number },
        },
      ],
      usePredefined: { type: Boolean },
    },
    default: {
      stages: [], //Need to add enum value of paymentPlannigStages
      userPredefined: false,
    },
  })
  paymentPlan: {
    stages: {
      paymentStage: string;
      percentage: number;
    }[];
    usePredefined: boolean;
  };
  //TBD
  @Prop({
    type: {
      timelines: [
        {
          event: {
            type: String,
            enum: PROPERTY_AS_PROJECT_TIMELINE,
          },
          date: { type: Date, required: true },
        },
      ],
      usePredefined: { type: Boolean, default: true }, //usePredefinedEnums true/false
    },
    default: {
      timelines: [], //Need to add enum value of projectTimelines
      usePredefined: true,
    },
  })
  projectTimeline: {
    timelines: {
      event: string;
      date: Date;
    }[];
    usePredefined: boolean;
  };
  @Prop({
    type: Date,
    default: null,
  })
  publishedAt: Date;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Admin.name })
  // deletedBy: Admin;

  @Prop({ default: null, type: Date })
  deletedAt: Date;

  @Prop({ type: String, default: '' })
  slug: string;

  @Prop({ type: SquareFeetSchema, default: () => ({}) })
  squareFeet: typeof SquareFeetSchema;

  @Prop({
    type: Number,
    default: 0,
  })
  serviceCharge: number;

  //to fetch rental data
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Rentals.name })
  rental: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    enum: PROPERTY_PAID_BY,
    default: PROPERTY_PAID_BY.TENANT,
  })
  paidBy: PROPERTY_PAID_BY;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  })
  listingOwner: mongoose.Schema.Types.ObjectId; //AgentId/AdminId
  @Prop({
    type: String,
    enum: PROPERTY_REVIEW_STATUS,
    default: PROPERTY_REVIEW_STATUS.PENDING,
  })
  reviewStatus: PROPERTY_REVIEW_STATUS; //pending,approve,rejected
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Documents.name }],
    default: [],
  })
  propertyDocuments: mongoose.Schema.Types.ObjectId[];
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: FloorPlans.name,
        default: null,
      },
    ],
  })
  floorPlans: mongoose.Schema.Types.ObjectId[]; //AgentId

  @Prop({
    type: {
      buy: { type: Number },
      sale: { type: Number },
      rent: { type: Number },
      totalProperties: { type: Number },
    },
    default: {
      buy: 0,
      sale: 0,
      rent: 0,
      totalProperties: 0,
    },
  })
  analyticsCounts: {
    buy: number;
    sale: number;
    rent: number;
    totalProperties: number;
  };
  @Prop({
    type: String,
    enum: PROPERTY_OCCUPANCY_OPTION,
    default: PROPERTY_OCCUPANCY_OPTION.VACANT,
  })
  occupancyOption: PROPERTY_OCCUPANCY_OPTION;
  @Prop({
    type: String,
    enum: PROPERTY_RESIDENCE_TYPES,
    default: PROPERTY_RESIDENCE_TYPES.FAMILY,
  })
  residenceType: PROPERTY_RESIDENCE_TYPES;
  @Prop({
    type: String,
    enum: PROPERTY_AVAILABILITY_STATUS,
    default: PROPERTY_AVAILABILITY_STATUS.AVAILABLE,
  })
  availabilityStatus: PROPERTY_AVAILABILITY_STATUS;
  @Prop({
    type: String,
    enum: PROPERTY_CONSTRUCTION_STATUS,
    default: PROPERTY_CONSTRUCTION_STATUS.COMPLETED,
  })
  constructionStatus: PROPERTY_CONSTRUCTION_STATUS;
  @Prop({
    type: String,
    enum: PROPERTY_VERFICATION_CHECK,
    default: PROPERTY_VERFICATION_CHECK.MANUAL,
  })
  verificationService: PROPERTY_VERFICATION_CHECK;
  @Prop({
    type: String,
    enum: PROPERTY_OFF_PLAN_SALE_TYPE,
    default: PROPERTY_OFF_PLAN_SALE_TYPE.INITIAL_SALE,
  })
  offplanSaleType: PROPERTY_OFF_PLAN_SALE_TYPE;
  @Prop({
    type: String,
    enum: PROPERTY_TENANCY_WAY_OF_PAYMENT,
    default: PROPERTY_TENANCY_WAY_OF_PAYMENT.BANK_TRANSFER,
  })
  tenancyWayOfPayments: PROPERTY_TENANCY_WAY_OF_PAYMENT;
  //may need a field to save history of this property purchases(between admin and agents)
}

export const PropertiesSchema = SchemaFactory.createForClass(Properties);
