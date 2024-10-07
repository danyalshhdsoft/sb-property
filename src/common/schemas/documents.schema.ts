import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
// import { User } from '@/src/users/schemas/user.schema';
import { Developers } from '@/src/developers/schemas/developers.schema';
import { FloorPlans } from '@/src/properties/schemas/floor-plans.schema';
import { Projects } from '@/src/projects/schemas/projects.schema';
import { Properties } from '@/src/properties/schemas/Properties.schema';
import { Rentals } from '@/src/properties/schemas/rentals.schema';
import { DOCUMENT_STATUS } from '../enums/global.enum';

@Schema({ timestamps: true })
export class Documents extends Document {
  @Prop({
    required: true,
    type: String,
  })
  documentType: string; //property-image, property-360, property-video etc...
  @Prop({
    required: true,
    type: String,
  })
  module: string; //property,project,floor-plan etc...
  @Prop({
    required: true,
    type: String,
  })
  documentFileType: string; //jpeg,mp4,pdf etc...
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
    enum: DOCUMENT_STATUS,
  })
  documentStatus: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Properties.name,
    default: null,
    // ref: 'Properties',
  })
  property: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Projects.name,
    default: null,
    // ref: 'Projects',
  })
  project: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: FloorPlans.name,
    default: null,
    // ref: 'FloorPlans',
  })
  floorPlan: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Rentals.name,
    default: null,
    // ref: 'FloorPlans',
  })
  rentals: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Developers.name,
    default: null,
    // ref: 'Developers',
  })
  developer: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    // ref: User.name,
  })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    // ref: User.name,
  })
  uploadedBy: mongoose.Schema.Types.ObjectId;
  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const DocumentsSchema = SchemaFactory.createForClass(Documents);
