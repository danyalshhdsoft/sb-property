import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { STATUS } from '@/src/common/enums/global.enum';
// import { User } from '@/src/users/schemas/user.schema';
import { Locations } from '@/src/locations/schemas/location.schema';
import { FLOOR_PLAN_STATE } from '../enums/properties.enum';
import { PropertyFloorPlanImages } from '../interface/property-schema.interface';

@Schema({ timestamps: true })
export class FloorPlans extends Document {
  @Prop({
    required: true,
    type: String,
    enum: STATUS,
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
    type: Object,
    default: () => ({}),
  })
  images: PropertyFloorPlanImages; //Don't forget to save document meta-data in Document schema

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

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const FloorPlansSchema = SchemaFactory.createForClass(FloorPlans);
