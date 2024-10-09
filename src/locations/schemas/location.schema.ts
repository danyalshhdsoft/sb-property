import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Coordinates } from './coordinates.schema';
import { CitiesSchema, Cities } from './city.schema';
import { LocalsSchema, Locals } from './locals.schema';

@Schema()
export class Locations extends Document {
  @Prop({
    type: {
      splitValue: { type: [String] },
      slugToDisplay: { type: String },
      formattedSlug: { type: String },
    },
    default: {
      splitValue: [],
      slugToDisplay: '',
      formattedSlug: '',
    },
  })
  slug: {
    splitValue: string[];
    slugToDisplay: string;
    formattedSlug: string;
  };

  @Prop({
    type: String,
    default: '',
  })
  placeId: string;

  @Prop({
    type: CitiesSchema,
  })
  city: Cities; //Should be an Id or subdocument
  @Prop({
    type: LocalsSchema,
  })
  local: Locals; //Should be an Id or subdocument

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata: any; //Data from MapBox or any response from Map Api integrated

  @Prop({ type: Coordinates, default: () => ({}), required: true })
  coordinates: Coordinates;

  @Prop({ type: String, required: true })
  module: string;
}

export const LocationsSchema = SchemaFactory.createForClass(Locations);
