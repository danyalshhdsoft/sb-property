import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Locations } from './schemas/location.schema';
import { Model } from 'mongoose';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Cities } from './schemas/city.schema';
import { Locals } from './schemas/locals.schema';
import { AddLocalAreaDTO } from './dto/add-area.dto';
import { AddCityDTO } from './dto/add-city.dto';
import { CoordinatesDTO } from './dto/add-coordinates.dto';
import { Coordinates } from './schemas/coordinates.schema';
import {
  commercialPlaceTypes,
  residentialPlaceTypes,
} from '../common/util/common.util';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class LocationsService {
  private googleApiKey = this.config.get<string>('GOOGLE_API_KEY');
  constructor(
    @InjectModel(Locations.name)
    private LocationsModel: Model<Locations>,
    @InjectModel(Cities.name)
    private CitiesModel: Model<Cities>,
    @InjectModel(Locals.name)
    private LocalsModel: Model<Locals>,
    @InjectModel(Coordinates.name)
    private CoordinatesModel: Model<Coordinates>,
    private readonly httpService: HttpService,
    @Inject(ConfigService) private config: ConfigService,
  ) {}

  async getAllLocations() {
    try {
      const aLocations = await this.LocationsModel.find({});
      return aLocations;
    } catch (oError) {
      throw new Error(oError);
    }
  }
  async filterBySubcategories(predictions: any[]) {
    const filteredResults = predictions.filter((place) => {
      const placeTypes = place.types; // Get types from the prediction
      return (
        residentialPlaceTypes.some((type) => placeTypes.includes(type)) ||
        commercialPlaceTypes.some((type) => placeTypes.includes(type))
      );
    });

    return filteredResults; // Return filtered predictions
  }

  async getAutocomplete(input: string) {
    try {
      const language = ['en', 'ar'];
      const parameters = `json?input=${input}&components=country:AE&language=${language[0]}&offset=3&key=${this.googleApiKey}`;
      const url =
        this.config.get<string>('GOOGLE_MAPS_PLACE_AUTO_COMPLETE_URL') +
        parameters;

      const response = await lastValueFrom(
        this.httpService.get(url).pipe(
          map((res) => res.data),
          catchError((error: AxiosError) => {
            throw {
              status: 500,
              message: 'Could not retireve place data',
              error: error,
            };
          }),
        ),
      );

      return this.filterBySubcategories(response.predictions); // Returns suggestions for autocomplete
    } catch (oError) {
      throw new HttpException(
        'Internal Server Error!Googly',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLocationRestrictedAutoComplete(
    input: string,
    latitude: number,
    longitude: number,
  ) {
    try {
      const language = ['en', 'ar'];
      const parameters = `json?input=${input}&components=country:AE&language=${language[0]}&offset=3&location=${latitude},${longitude}&radius=50000&key=${this.googleApiKey}`;
      const url =
        this.config.get<string>('GOOGLE_MAPS_PLACE_AUTO_COMPLETE_URL') +
        parameters;

      const response = await lastValueFrom(
        this.httpService.get(url).pipe(
          map((res) => res.data),
          catchError((error: AxiosError) => {
            throw {
              status: 500,
              message: 'Could not retireve place data',
              error: error,
            };
          }),
        ),
      );

      return this.filterBySubcategories(response.predictions);
    } catch (oError) {
      throw new HttpException(
        'Internal Server Error!Googly',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get place details by placeId
  async getPlaceDetails(placeId: string) {
    const params = `json?place_id=${placeId}&key=${this.googleApiKey}&fields=formatted_address,name,geometry,adr_address,address_components,business_status,vicinity,plus_code`;
    const url =
      this.config.get<string>('GOOGLE_MAPS_PLACE_DETAILS_URL') + params;

    const response = await lastValueFrom(
      this.httpService.get(url).pipe(map((res) => res.data)),
    );

    const { result } = response;

    return result;

    // return {
    //   name: result.name,
    //   address: result.formatted_address,
    //   location: result.geometry.location,
    //   totalResult: result,
    //   developer: null, // Placeholder, to be filled by external data (optional)
    // };
  }

  async getGeocodeResponse(place: string) {
    const params = `json?address=${place}&key=${this.googleApiKey}`;
    const urlGeocode =
      this.config.get<string>('GOOGLE_MAPS_GEOCODE_URL') + params;

    const geocodeResponse = await lastValueFrom(
      this.httpService.get(urlGeocode).pipe(
        map((res) => res.data),
        catchError((error: AxiosError) => {
          throw {
            status: 500,
            message: 'Could not retrieve geocode data',
            error: error,
          };
        }),
      ),
    );

    // Get the coordinates from the response
    const cityCoordinates = geocodeResponse.results[0].geometry.location;
    return `City Coordinates: ${cityCoordinates.lat}, ${cityCoordinates.lng}`;
  }

  async normalizeGoogleResponse(response, module) {
    const addressComponents = response.address_components;

    const city =
      addressComponents.find((component) =>
        component.types.includes('locality'),
      )?.long_name || '';

    const subLocalities = addressComponents
      .filter(
        (component) =>
          component.types.includes('sublocality') ||
          component.types.includes('sublocality_level_1') ||
          component.types.includes('sublocality_level_2'),
      )
      .map((component) => component.long_name);

    const local = response?.name;
    const country =
      addressComponents.find((component) => component.types.includes('country'))
        ?.short_name || '';

    const coordinates = {
      geometry: {
        type: 'Point',
        coordinates: {
          latitude: response.geometry.location.lat,
          longitude: response.geometry.location.lng,
        },
      },
      viewport: {
        topLeft: {
          latitude: response.geometry.viewport.northeast.lat,
          longitude: response.geometry.viewport.northeast.lng,
        },
        bottomRight: {
          latitude: response.geometry.viewport.southwest.lat,
          longitude: response.geometry.viewport.southwest.lng,
        },
      },
      metadata: response,
    };

    const locationSlug = {
      splitValue: response?.formatted_address.replace(/\s+/g, '').split('-'),
      slugToDisplay: response?.formatted_address.replace(/-/g, '/'),
      formattedSlug: response?.formatted_address
        .replace(/\s+/g, '')
        .replace(/-/g, '/')
        .toLowerCase(),
    };
    const citySlug =
      city?.toLowerCase().replace(/\s+/g, '-') +
      '-' +
      country?.toLowerCase().replace(/\s+/g, '-');
    const localSlug =
      subLocalities && subLocalities.length > 0
        ? local.replace(/\s+/g, '').toLowerCase() +
          '/' +
          subLocalities?.join('/').replace(/\s+/g, '').toLowerCase()
        : local;

    const cityDTOStructureData = {
      city,
      country,
      metadata: response,
      coordinates,
      slug: citySlug,
    };

    const localDTOStructureData = {
      local,
      subLocalities,
      coordinates,
      metadata: response,
      slug: localSlug,
    };

    const locationDTOStructureData = {
      coordinates,
      metadata: response,
      slug: locationSlug,
      module: module,
    };

    return {
      cityDTOStructureData,
      localDTOStructureData,
      locationDTOStructureData,
      coordinates,
    };
  }

  async normalizeApiStreetResponse(response, module) {
    const city = response.city || '';
    const local = response.subLocality || '';
    const subLocalities = response.subLocality || '';
    const country = response.countryCode || '';
    const citySlug = '';
    const localSlug = '';
    const locationSlug = '';

    const coordinates = {
      geometry: {
        type: 'Point',
        coordinates: {
          latitude: response.lat,
          longitude: response.lng,
        },
      },
      viewport: {
        topLeft: {
          latitude: response.lat,
          longitude: response.lng,
        },
        bottomRight: {
          latitude: response.lat,
          longitude: response.lng,
        },
      },
      metadata: response,
    };

    const cityDTOStructureData = {
      city,
      country,
      metadata: response,
      coordinates,
      slug: citySlug,
    };

    const localDTOStructureData = {
      local,
      subLocalities,
      coordinates,
      metadata: response,
      slug: localSlug,
    };

    const locationDTOStructureData = {
      coordinates,
      metadata: response,
      slug: locationSlug,
      module: module,
    };

    return {
      cityDTOStructureData,
      localDTOStructureData,
      locationDTOStructureData,
      coordinates,
    };
  }

  async normalizeApiResponse(apiResponse: any, source: string, module) {
    if (source === 'google') {
      return await this.normalizeGoogleResponse(apiResponse, module);
    } else if (source === 'apistreet') {
      return await this.normalizeApiStreetResponse(apiResponse, module);
    }
    // Add more API normalizers as needed
    throw new Error('Unknown API source');
  }

  async addNewLocation(
    oLocationData: any,
    source: string,
    placeId: string,
    module,
  ) {
    try {
      const normalizedData = await this.normalizeApiResponse(
        oLocationData,
        source,
        module,
      );

      const oCoordinates = await this.addNewCoordinates(
        normalizedData.coordinates,
      );
      const cities = await this.addNewCity(normalizedData.cityDTOStructureData);
      normalizedData['city'] = cities;
      const oLocals = await this.addNewLocal(
        normalizedData.localDTOStructureData,
      );
      normalizedData.locationDTOStructureData['placeId'] = placeId;
      const aCities = [cities];
      const aLocals = [oLocals];
      normalizedData.locationDTOStructureData['city'] = aCities;
      normalizedData.locationDTOStructureData['local'] = aLocals;
      normalizedData.locationDTOStructureData['coordinates'] = oCoordinates;

      const newLocation = await this.LocationsModel.create(
        normalizedData.locationDTOStructureData,
      );
      return {
        locationId: newLocation._id,
        aCities,
        aLocals,
      };
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.FORBIDDEN);
    }
  }

  async addNewCoordinates(oCoordinates: CoordinatesDTO) {
    try {
      const saveCoordinates = await this.CoordinatesModel.create(oCoordinates);
      return saveCoordinates;
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.FORBIDDEN);
    }
  }

  async addNewCity(oCityData: AddCityDTO) {
    try {
      const newCities = await this.CitiesModel.create(oCityData);
      return newCities;
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.FORBIDDEN);
    }
  }

  async addNewLocal(oLocalAreaData: AddLocalAreaDTO) {
    try {
      const newLocalAreas = await this.LocalsModel.create(oLocalAreaData);
      return newLocalAreas;
    } catch (oError) {
      throw new HttpException(oError, HttpStatus.FORBIDDEN);
    }
  }
}
