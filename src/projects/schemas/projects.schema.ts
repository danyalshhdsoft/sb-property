import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  PROJECT_DOCUMENT_STATUS,
  PROJECT_STATUS,
} from '../enums/projects.enum';
import { Locations } from '@/src/locations/schemas/location.schema';
import { PAYMENT_OPTIONS } from '@/src/common/enums/global.enum';
import { Developers } from '@/src/developers/schemas/developers.schema';
import { Amenities } from '@/src/amenities/interface/amenities.interface';
import { Buildings } from '@/src/common/schemas/buildings.schema';

@Schema({ timestamps: true })
export class Projects extends Document {
  @Prop({
    required: true,
    type: String,
    default: '',
  })
  projectTitle: string;
  @Prop({
    type: String,
    default: '',
  })
  slug: string;
  @Prop({
    required: true,
    type: Number,
    default: 0,
  })
  priceFrom: number;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Developers.name,
    default: null,
  })
  developerId: mongoose.Schema.Types.ObjectId;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Locations.name,
    default: null,
  })
  location: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: String,
    default: '',
  })
  placeId: string;
  @Prop({
    type: String,
    enum: PAYMENT_OPTIONS,
    default: PAYMENT_OPTIONS.INSTALLMENT_SETTLEMENT,
  })
  paymentOptions: PAYMENT_OPTIONS;
  @Prop({
    type: {
      stages: [
        {
          paymentStage: { type: String },
          percentage: { type: Number },
        },
      ],
      usePredefined: { type: Boolean },
    },
    default: {
      stages: [], //Need to add enum value of paymentPlanningStages
      userPredefined: false,
    },
  })
  paymentPlan: {
    stages: {
      paymentStage: string;
      percentage: number;
    }[];
    usePredefined: boolean;
  };
  @Prop({
    type: String,
    default: '',
  })
  pitchInterstedParties: string; //who may be intrested in(description)
  @Prop({
    type: String,
    default: '',
  })
  aboutLocation: string;
  @Prop({
    type: String,
    default: '',
  })
  aboutProject: string;
  // This below is the model the field will be saved
  // amenities: {
  //   healthAndFitness: {
  //     features: {
  //       swimmingPool: boolean;
  //       jaccuzi: boolean;
  //     };
  //     isActive: boolean;
  //     title: string;
  //     slug: string;
  //   };
  //   miscellaneous: {
  //     features: {
  //       view: string;
  //       floorno: number;
  //       petPolicy: boolean;
  //       area: number;
  //       numberOfSwimmingPools: number;
  //       numberOfElevators: number;
  //     };
  //     isActive: boolean;
  //     title: string;
  //     slug: string;
  //   };
  // }[];
  //He can add other count or any of his own custom ammenities in here by giving following data in form
  // type/choose amenities(Health And Fitness, Miscellaneous etc...)
  // type/choose features(swimming pool,jaccuzi, etc....)
  // select datatype(text(string), number, multiple(array), single(object), check(Boolean))
  // icon : false
  // isActive: false
  //if icon is true then the feature format will be
  // sauna : {
  // value: {type: Boolean, default: false},
  // icon: {type: String, default: ''} //cloud storage link
  // },
  // else
  // sauna: { type: String}
  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] })
  amenities: Amenities[];

  @Prop({
    required: true,
    type: String,
    enum: PROJECT_STATUS,
    default: PROJECT_STATUS.PENDING,
  })
  projectStatus: PROJECT_STATUS;
  @Prop({
    required: true,
    type: String,
    enum: PROJECT_DOCUMENT_STATUS,
    default: PROJECT_DOCUMENT_STATUS.PENDING,
  })
  documentStatus: string;
  @Prop({
    type: [String],
    default: [],
  })
  documents: string[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Properties' }],
    default: [],
  })
  propertyId: mongoose.Schema.Types.ObjectId[]; //AgentId

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Buildings.name,
    default: null,
  })
  building: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Date,
    default: null,
  })
  listedTimeStamp: Date;
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

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Admin.name })
  // deletedBy: Admin;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
