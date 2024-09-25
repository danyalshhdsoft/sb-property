import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CitiesSchema, Cities } from './city.schema';
import { Coordinates } from './coordinates.schema';

@Schema()
export class Locals extends Document {
  @Prop({ type: String, default: '', required: true })
  local: string;

  @Prop({ type: [String], default: [], required: true })
  subLocalities: string[];

  @Prop({ type: String, default: '', required: true })
  slug: string;

  @Prop({ type: CitiesSchema })
  city: Cities; //If This Local has multiple Cities(Array or Object(Eg: Cities[] or Cities))?

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata: any;

  @Prop({ type: Coordinates, default: () => ({}), required: true })
  coordinates: Coordinates;
}

export const LocalsSchema = SchemaFactory.createForClass(Locals);
