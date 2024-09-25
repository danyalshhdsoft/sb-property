import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Documents } from '@/src/common/schemas/documents.schema';
@Schema({ timestamps: true })
export class Developers extends Document {
  @Prop({
    required: true,
    type: String,
    default: '',
  })
  developerName: string;
  @Prop({
    type: String,
    default: '',
  })
  slug: string;
  @Prop({
    type: String,
    default: '',
  })
  link: string;
  @Prop({
    default: '',
    type: String,
  })
  shortDescription: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Documents.name }],
    default: [],
  })
  documents: mongoose.Schema.Types.ObjectId[];
  @Prop({
    type: Date,
    default: null,
  })
  createdAt: Date;
  @Prop({
    type: Date,
    default: null,
  })
  updatedAt: Date;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const DevelopersSchema = SchemaFactory.createForClass(Developers);
