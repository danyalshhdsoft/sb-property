import { Amenities } from '@/src/common/schemas/amenities.schema';
import { INestApplicationContext } from '@nestjs/common';
import { Model } from 'mongoose';

const AmenitiesSeedingData = [
  {
    title: 'Health and Fitness',
    code: 'sb-health-and-fitness',
    display: true,
    options: [
      {
        code: 'sb-first-aid-medical-center',
        name: 'First Aid Medical Center',
        component: 'checkbox',
        type: null,
        options: [],
        value: true,
        multipleSelection: false,
        display: true,
        required: true,
      },
      {
        code: 'sb-gym-or-health-club ',
        name: 'Gym or Health Club',
        component: 'checkbox',
        type: null,
        options: [],
        value: true,
        multipleSelection: false,
        display: true,
        required: true,
      },
      {
        code: 'sb-jacuzzi',
        name: 'Jacuzzi',
        component: 'checkbox',
        type: null,
        options: [],
        value: true,
        multipleSelection: false,
        display: true,
        required: true,
      },
    ],
  },
  {
    title: 'Building',
    display: true,
    code: 'sb-building',
    options: [
      {
        code: 'sb-completion-year',
        name: 'Completion Year',
        component: 'input',
        type: 'number',
        options: [],
        value: 2025,
        multipleSelection: false,
        display: true,
        required: true,
      },
    ],
  },
  {
    title: 'Miscellaneous',
    display: true,
    code: 'sb-miscellaneous',
    options: [
      {
        code: 'sb-rent-is-paid',
        name: 'Rent Is Paid',
        component: 'dropdown',
        type: null,
        options: ['Quarterly', 'Monthly', 'Yearly'],
        multipleSelection: false,
        value: null,
        display: true,
        required: true,
      },
    ],
  },
];

export async function seedSbDefinedAmenities(
  appContext: INestApplicationContext,
) {
  const AmenitiesModel = appContext.get<Model<Amenities>>(
    Amenities.name + 'Model',
  );
  await AmenitiesModel.create(AmenitiesSeedingData);
}
