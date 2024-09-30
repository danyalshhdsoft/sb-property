import { Controller } from '@nestjs/common';
import { LocationsService } from './location.service';
import { KAFKA_LOCATIONS_TOPIC } from '../utils/constants/kafka-const';
import { MessagePattern } from '@nestjs/microservices';
@Controller('locations')
export class LocationsController {
  constructor(private readonly LocationsService: LocationsService) {}

  @MessagePattern(KAFKA_LOCATIONS_TOPIC.retrieve_locations)
  async getAllLocations() {
    try {
      const response = await this.LocationsService.getAllLocations();
      return response;
    } catch (oError) {
      throw new Error(oError);
    }
  }

  // @Get()
  // async getAllLocations() {
  //   try {
  //     const response = await this.LocationsService.getAllLocations();
  //     return new ApiResponse(response);
  //   } catch (oError) {
  //     throw new Error(oError);
  //   }
  // }

  // Endpoint for autocomplete search box
  @MessagePattern(KAFKA_LOCATIONS_TOPIC.locations_autocomplete)
  async getAutocomplete(data: any) {
    return await this.LocationsService.getAutocomplete(data);
  }

  // Endpoint for restricted autocomplete search box
  @MessagePattern(KAFKA_LOCATIONS_TOPIC.restricted_location_auto_complete)
  async getLocationRestrictedAutoComplete(data: any) {
    return await this.LocationsService.getLocationRestrictedAutoComplete(
      data.input,
      data.latitude,
      data.longitude,
    );
  }

  // Endpoint for fetching place details
  @MessagePattern(KAFKA_LOCATIONS_TOPIC.locations_details)
  async getPlaceDetails(data: any) {
    const placeDetails = await this.LocationsService.getPlaceDetails(data);

    // Optional: Enrich with developer/project details from external data
    // const additionalDetails = await this.LocationsService.getDeveloperDetails(
    //   placeDetails.address,
    // );

    return {
      ...placeDetails,
      // ...additionalDetails
    };
  }

  // Endpoint for autocomplete search box
  @MessagePattern(KAFKA_LOCATIONS_TOPIC.locations_geocode)
  async getGeocode(data: any) {
    return this.LocationsService.getGeocodeResponse(data);
  }
}
