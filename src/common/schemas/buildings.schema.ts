import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Locations } from '@/src/locations/schemas/location.schema';
import { STATUS } from '@/src/common/enums/global.enum';
@Schema({ timestamps: true })
export class Buildings extends Document {
  @Prop({
    type: String,
    default: '',
  })
  buildingName: string;
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
  address: string;
  @Prop({
    type: String,
    default: '',
  })
  placeId: string;
  @Prop({
    required: true,
    type: String,
    enum: STATUS,
    default: STATUS.APPROVED,
  })
  status: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  })
  createdBy: mongoose.Schema.Types.ObjectId; //agent or adminId

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const BuildingsSchema = SchemaFactory.createForClass(Buildings);
