import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Coordinates } from './coordinates.schema';

@Schema()
export class Cities extends Document {
  @Prop({ type: String, default: 'AE', required: true })
  country: string; //now its string; later need give Country schema ref and to type objectId

  @Prop({ type: String, default: '', required: true })
  city: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata: any;

  @Prop({ type: Coordinates, default: () => ({}) })
  coordinates: Coordinates;
}

export const CitiesSchema = SchemaFactory.createForClass(Cities);
