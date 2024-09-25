import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueSlugConstraint implements ValidatorConstraintInterface {
  validate(amenities: any[]) {
    // Ensure amenities is an array
    if (!Array.isArray(amenities)) {
      return false; // or throw an error
    }

    // Extract slugs from the AmenitiesDTO instances
    const slugs = amenities
      .map((amenity) => {
        if (typeof amenity.slug === 'string') {
          return amenity.slug;
        }
        return null; // Handle the case where slug might be undefined
      })
      .filter((slug) => slug !== null); // Remove null values

    const uniqueSlugs = new Set(slugs);
    return uniqueSlugs.size === slugs.length; // true if all slugs are unique
  }

  defaultMessage() {
    return 'Duplicate slug values are not allowed in amenities array';
  }
}

export function IsUniqueSlug(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueSlugConstraint,
    });
  };
}
