import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { AmenitiesOptions } from '@/src/amenities/interface/amenities-options.interface';
import { Amenities } from '@/src/amenities/schemas/amenities.schema';

const OptionsSchema = new MongooseSchema({
  amenitiesOptionSelected: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Amenities',
    //since while update this field can be empty so the required true should be in front
  },
  code: { type: String },
  name: { type: String },
  component: { type: String },
  type: { type: String, default: null },
  options: { type: [String] },
  value: { type: mongoose.Schema.Types.Mixed, default: null }, // Allows for multiple data types
  multipleSelection: { type: Boolean },
  display: { type: Boolean },
  required: { type: Boolean },
});

@Schema({ timestamps: true })
export class SubDocumentAmenities extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Amenities.name,
    default: null,
  })
  amenitiesSelected: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: String,
  })
  title: string;
  @Prop({
    type: String,
  })
  code: string;
  @Prop({
    type: Boolean,
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

export const SubDocumentAmenitiesSchema =
  SchemaFactory.createForClass(SubDocumentAmenities);
