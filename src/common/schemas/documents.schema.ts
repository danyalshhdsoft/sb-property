import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
// import { User } from '@/src/users/schemas/user.schema';
import { PROPERTY_DOCUMENT_STATUS } from '@/src/properties/enums/properties.enum';

@Schema({ timestamps: true })
export class Documents extends Document {
  @Prop({
    required: true,
    type: String,
  })
  documentType: string;
  @Prop({
    required: true,
    type: String,
  })
  documentFileType: string;
  @Prop({
    required: true,
    type: String,
  })
  documentUrl: string;
  @Prop({
    required: true,
    type: String,
  })
  fileName: string;
  @Prop({
    required: true,
    type: String,
  })
  size: string;
  @Prop({
    required: true,
    type: String,
    enum: PROPERTY_DOCUMENT_STATUS,
  })
  documentStatus: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: mongoose.Schema.Types.ObjectId;
}

export const DocumentsSchema = SchemaFactory.createForClass(Documents);
