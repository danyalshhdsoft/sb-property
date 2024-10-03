import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CATEGORY } from '@/src/common/enums/category.enum';

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
    type: Boolean,
  })
  isFurnishable: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const PropertyTypesSchema = SchemaFactory.createForClass(PropertyType);
