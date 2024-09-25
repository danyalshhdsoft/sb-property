import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { STATUS } from '@/src/common/enums/global.enum';
import { Documents } from '@/src/common/schemas/documents.schema';
// import { User } from '@/src/users/schemas/user.schema';
import { Locations } from '@/src/locations/schemas/location.schema';
import { FLOOR_PLAN_STATE } from '../enums/properties.enum';

@Schema({ timestamps: true })
export class FloorPlans extends Document {
  @Prop({
    required: true,
    type: String,
    enum: STATUS,
    default: STATUS.PENDING,
  })
  documentStatus: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  addedBy: mongoose.Schema.Types.ObjectId; //AgentId

  //does each image(image2d, image3d etc..) need a description and title with it?
  @Prop({
    type: {
      image2ds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Documents.name,
          default: null,
        },
      ],
      image3ds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Documents.name,
          default: null,
        },
      ],
      videos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Documents.name,
          default: null,
        },
      ],
      others: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Documents.name,
          default: null,
        },
      ],
    },
    default: {
      image2ds: [],
      image3ds: [],
      videos: [],
      others: [],
    },
  })
  images: {
    image2ds: mongoose.Schema.Types.ObjectId[];
    image3ds: mongoose.Schema.Types.ObjectId[];
    videos: mongoose.Schema.Types.ObjectId[];
    others: mongoose.Schema.Types.ObjectId[];
  };

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Locations.name,
    default: null,
  })
  location: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Properties',
    default: null,
  })
  propertyId: mongoose.Schema.Types.ObjectId; //AgentId

  @Prop({
    required: true,
    type: String,
    enum: FLOOR_PLAN_STATE,
    default: FLOOR_PLAN_STATE.AVAILABLE,
  })
  floorPlanState: FLOOR_PLAN_STATE;

  @Prop({
    type: Number,
    default: 0,
  })
  washroomCount: number;
  @Prop({
    type: Number,
    default: 0,
  })
  bedroomCount: number;
}

export const FloorPlansSchema = SchemaFactory.createForClass(FloorPlans);
