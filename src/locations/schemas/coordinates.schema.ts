import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Coordinates {
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed, // Allows for flexible structure
      required: true,
    },
  })
  geometry: {
    type: string;
    coordinates: { latitude: number; longitude: number }; //Points Coordinates
  };

  @Prop({
    type: {
      topLeft: {
        latitude: Number,
        longitude: Number,
      },
      bottomRight: {
        latitude: Number,
        longitude: Number,
      },
    },
    required: true,
  })
  viewport: {
    topLeft: { latitude: number; longitude: number };
    bottomRight: { latitude: number; longitude: number };
  };

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata: any;

  @Prop({ type: Object, default: {} })
  links: object;
}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);
