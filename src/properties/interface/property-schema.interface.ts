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

interface PropertyDocumentObjectData {
  link: string;
  meta: any;
}

export interface PropertyDocument {
  image: PropertyDocumentObjectData[];
  image360: PropertyDocumentObjectData[];
  videoLinks: PropertyDocumentObjectData[];
}
