import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LocationsService } from './location.service';
import ApiResponse from '../utils/api-response.util';
import { AuthFlag } from '../common/decorators/auth-flag.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('locations')
@UseGuards(AuthGuard)
@AuthFlag('privateRoute')
export class LocationsController {
  constructor(private readonly LocationsService: LocationsService) {}

  @Get()
  async getAllLocations() {
    try {
      const response = await this.LocationsService.getAllLocations();
      return new ApiResponse(response);
    } catch (oError) {
      throw new Error(oError);
    }
  }

  // Endpoint for autocomplete search box
  @Get('autocomplete')
  async getAutocomplete(@Query('input') input: string) {
    return this.LocationsService.getAutocomplete(input);
  }

  // Endpoint for autocomplete search box
  @Get('restricted-location-auto-complete')
  async getLocationRestrictedAutoComplete(
    @Query('input') input: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    return this.LocationsService.getLocationRestrictedAutoComplete(
      input,
      latitude,
      longitude,
    );
  }

  // Endpoint for fetching place details
  @Get('details')
  async getPlaceDetails(@Query('placeId') placeId: string) {
    const placeDetails = await this.LocationsService.getPlaceDetails(placeId);

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
  @Get('geocode')
  async getGeocode(@Query('input') input: string) {
    return this.LocationsService.getGeocodeResponse(input);
  }
}
