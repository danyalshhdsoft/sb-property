import { PropertyType } from '@/src/propertyTypes/schemas/property-type.schema';
import { INestApplicationContext } from '@nestjs/common';
import { Model } from 'mongoose';

const PropertyTypesSeedingData = [
  // Residential
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'apartment',
    googlePlaceType: 'apartment',
    isFurnishable: true,
    isActive: true,
  },
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'villa',
    googlePlaceType: 'lodging',
    isFurnishable: true,
    isActive: true,
  },
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'condo',
    googlePlaceType: 'condominium_complex',
    isFurnishable: true,
    isActive: true,
  },
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'townhouse',
    googlePlaceType: 'house',
    isFurnishable: true,
    isActive: true,
  },
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'duplex',
    googlePlaceType: 'house',
    isFurnishable: true,
    isActive: true,
  },
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'penthouse',
    googlePlaceType: 'apartment',
    isFurnishable: true,
    isActive: true,
  },
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'studio',
    googlePlaceType: 'apartment',
    isFurnishable: true,
    isActive: true,
  },

  // Commercial
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'office',
    googlePlaceType: 'real_estate_agency',
    isFurnishable: false,
    isActive: true,
  },
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'warehouse',
    googlePlaceType: 'storage',
    isFurnishable: false,
    isActive: true,
  },
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'retail',
    googlePlaceType: 'shopping_mall',
    isFurnishable: false,
    isActive: true,
  },
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'shopping mall',
    googlePlaceType: 'shopping_mall',
    isFurnishable: false,
    isActive: true,
  },
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'industrial',
    googlePlaceType: 'storage',
    isFurnishable: false,
    isActive: true,
  },
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'hotel',
    googlePlaceType: 'lodging',
    isFurnishable: false,
    isActive: true,
  },
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'coworking space',
    googlePlaceType: 'real_estate_agency',
    isFurnishable: false,
    isActive: true,
  },

  // Residential land
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'land',
    googlePlaceType: 'point_of_interest',
    isFurnishable: false,
    isActive: true,
  },

  // Commercial land
  {
    parentType: 'COMMERCIAL_PROPERTY_TYPES',
    category: 'commercial land',
    googlePlaceType: 'point_of_interest',
    isFurnishable: false,
    isActive: true,
  },

  // Mixed-use properties
  {
    parentType: 'RESIDENTIAL_PROPERTY_TYPES',
    category: 'mixed-use',
    googlePlaceType: 'establishment',
    isFurnishable: true,
    isActive: true,
  },
];

export async function seedSbDefinedPropertyTypes(
  appContext: INestApplicationContext,
) {
  const PropertyTypesModel = appContext.get<Model<PropertyType>>(
    PropertyType.name + 'Model',
  );
  await PropertyTypesModel.create(PropertyTypesSeedingData);
}
