export interface PaymentPlan {
  title?: string;
  percentage?: number;
  caption?: string;
  serial?: number;
}

export interface ProjectTimeline {
  title: string;
  date: Date;
  subtitle: string;
  serial: number;
}

export interface SquareFeet {
  areaInSquareMeters: number;
  areaInSquareYards: number;
  totalAreaInSquareFeet: number;
  pricePerSquareFeet: number;
}

export interface TenantEligibility {
  preferredTenantCountry: string;
  preferredTenantCommunity: string;
}

export interface PropertyDocument {
  imageUrl: string[];
  image360Url: string[];
  videoLinksUrl: string[];
}

//Needs a discussion to integrate floorplan.
//For now this is optional as the structure is not confirmed.
export interface PropertyFloorPlanImages {
  image2ds: string[];
  image3ds: string[];
  videos: string[];
  others: string[];
}

export interface LicenseCriteria {
  title: string;
  isActive: boolean;
}

// export interface LegalDocuments {
//   propertyLicense: Types.ObjectId;
//   documentUrl: string;
// }
