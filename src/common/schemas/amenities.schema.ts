import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AmenitiesOptions } from '../interfaces/amenities-options.interface';
@Schema({ timestamps: true })
export class Amenities extends Document {
  @Prop({
    type: String,
    required: true,
  })
  title: string;
  @Prop({
    type: String,
  })
  code: string;
  @Prop({
    type: Boolean,
    default: true,
  })
  display: boolean;
  @Prop({
    required: true,
  })
  options: AmenitiesOptions[];
  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const AmenitiesSchema = SchemaFactory.createForClass(Amenities);
