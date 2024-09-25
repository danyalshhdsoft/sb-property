interface HealthAndFitnessFeaturesAttributes {
  value: boolean;
  icon: string;
}

interface HealthAndFitnessFeatures {
  swimmingPool: HealthAndFitnessFeaturesAttributes;
  jaccuzi: HealthAndFitnessFeaturesAttributes;
}

interface HealthAndFitness {
  features: HealthAndFitnessFeatures;
  isActive: boolean;
  title: string;
  slug: string;
}

interface MiscellaneousFeatures {
  view: string;
  floorno: number;
  petPolicy: boolean;
  area: number;
  numberOfSwimmingPools: number;
  numberOfElevators: number;
}

interface Miscellaneous {
  features: MiscellaneousFeatures;
  isActive: boolean;
  title: string;
  slug: string;
}

export interface Amenities {
  healthAndFitness: HealthAndFitness;
  miscellaneous: Miscellaneous;
  [key: string]: any;
}
