import { Developers } from '@/src/developers/schemas/developers.schema';
import { INestApplicationContext } from '@nestjs/common';
import { Model } from 'mongoose';

const DevelopersSeedingData = [
  {
    developerName: 'EMAAR',
    slug: 'emaar',
    link: 'https://property.emaar.com',
    shortDescription:
      "Emaar Properties is an Emirati real estate development company located in the United Arab Emirates. The two largest shareholders are Dubai ruler Mohammed bin Rashid Al Maktoum and the UAE's sovereign wealth fund Investment Corporation of Dubai.",
    documents: ['64f84b2f2f3d3a001b5b4b75', '64f84b8d2f3d3a001b5b4b77'],
  },
  {
    developerName: 'DAMAC',
    slug: 'emaar',
    link: 'https://www.damacproperties.com',
    shortDescription:
      "DAMAC Properties is part of DAMAC Group that has been shaping the Middle East's luxury real estate market since 1982, delivering iconic residential, commercial and leisure properties for sale across the region and beyond.",
    documents: ['64f84b2f2f3d3a001b5b4b75', '64f84b8d2f3d3a001b5b4b77'],
  },
];

export async function seedSbDefinedDevelopers(
  appContext: INestApplicationContext,
) {
  const DevelopersModel = appContext.get<Model<Developers>>(
    Developers.name + 'Model',
  );
  await DevelopersModel.create(DevelopersSeedingData);
}
