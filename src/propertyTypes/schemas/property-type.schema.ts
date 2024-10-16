import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CATEGORY } from '@/src/common/enums/category.enum';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PropertyType extends Document {
  @Prop({
    required: true,
    type: String,
    enum: CATEGORY,
  })
  parentType: CATEGORY;

  @Prop({
    required: true,
    type: String,
  })
  category: string;

  @Prop({
    required: true,
    type: String,
  })
  googlePlaceType: string;

  @Prop({
    default: false,
    type: Boolean,
  })
  isFurnishable: boolean;

  @Prop({
    default: true,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const PropertyTypesSchema = SchemaFactory.createForClass(PropertyType);
