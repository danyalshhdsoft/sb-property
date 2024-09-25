import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Documents } from '@/src/common/schemas/documents.schema';
import { CATEGORY, SUB_CATEGORY } from '../../properties/enums/category.enum';
import { Locations } from '@/src/locations/schemas/location.schema';
import { Amenities } from '@/src/common/interfaces/amenities.interface';
import { Developers } from '@/src/developers/schemas/developers.schema';
import { STATUS } from '@/src/common/enums/global.enum';
//Building collection or details woll be filled by admin/agent while adding properties(amenities section in frontend)
//Or while adding projects.
@Schema({ timestamps: true })
export class Buildings {
  @Prop({
    required: true,
    type: String,
    enum: CATEGORY,
    default: CATEGORY.RESIDENTIAL_PROPERTY_TYPES,
  })
  category: string;
  @Prop({
    type: {
      categoryType: String,
      hasBed: { type: Boolean },
      hasFurnishingStatus: { type: Boolean },
      hasPropertyAge: { type: Boolean },
      hasRoomTypes: { type: Boolean },
      order: { type: Number },
      otherDetails: {
        unitNo: { type: String },
        floorNo: { type: Number },
        apartmentName: { type: String },
      },
    },
    default: {
      categoryType: SUB_CATEGORY, //recheck this categoryType value/enum
      hasBed: false,
      hasFurnishingStatus: false,
      hasPropertyAge: false,
      hasRoomTypes: false,
      order: 0,
      otherDetails: {
        unitNo: '',
        floorNo: false,
        apartmentName: '',
      },
    },
  })
  subCategory: {
    categoryType: string;
    hasBed: boolean;
    hasFurnishingStatus: boolean;
    hasPropertyAge: boolean;
    hasRoomTypes: boolean;
    order: number;
    otherDetails: {
      unitNo: string;
      floorNo: number;
      apartmentName: string;
    };
  };
  @Prop({
    type: String,
    default: '',
  })
  buildingName: string;

  @Prop({
    type: String,
    default: '',
  })
  address: string;
  @Prop({
    type: String,
    default: '',
  })
  placeId: string;
  @Prop({
    type: Number,
    default: 0,
  })
  yearOfCompletion: number;
  @Prop({
    type: Number,
    default: 0,
  })
  totalFloors: number;
  @Prop({
    type: Number,
    default: 0,
  })
  totalRetailCenters: number;
  @Prop({
    type: Number,
    default: 0,
  })
  totalParkingSlots: number;
  @Prop({
    type: Number,
    default: 0,
  })
  totalBuildingArea: number;
  @Prop({
    type: Number,
    default: 0,
  })
  totalElevators: number;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Documents.name }],
    default: [],
  })
  buildingDocuments: mongoose.Schema.Types.ObjectId[];
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Locations.name,
    default: null,
  })
  location: mongoose.Schema.Types.ObjectId;
  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] }) //add few more enum values
  amenities: Amenities[];
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Developers.name,
    default: null,
  })
  developerId: mongoose.Schema.Types.ObjectId;
  @Prop({
    required: true,
    type: String,
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  })
  createdBy: mongoose.Schema.Types.ObjectId;
}

export const BuildingsSchema = SchemaFactory.createForClass(Buildings);
