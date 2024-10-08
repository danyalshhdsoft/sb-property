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
