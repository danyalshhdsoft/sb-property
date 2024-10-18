import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { AmenitiesOptions } from '../interface/amenities-options.interface';

const OptionsSchema = new MongooseSchema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  component: { type: String, required: true },
  type: { type: String, default: null },
  options: { type: [String], default: [] },
  value: { type: mongoose.Schema.Types.Mixed, default: null }, // Allows for multiple data types
  multipleSelection: { type: Boolean, default: false },
  display: { type: Boolean, default: true },
  required: { type: Boolean, default: true },
});

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
    type: [OptionsSchema],
    required: true,
  })
  options: AmenitiesOptions[];
  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const AmenitiesSchema = SchemaFactory.createForClass(Amenities);
