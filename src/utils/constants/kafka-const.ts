export const KAFKA_CONSUMER_GROUP_ID = {
  properties_consumer: 'properties-consumer',
  projects_consumer: 'projects-consumer',
  developers_consumer: 'developers-consumer',
  locations_consumer: 'locations-consumer',
};

export const KAFKA_OPTIONS_CLIENT_ID = {
  properties_service: 'properties-service',
  projects_service: 'projects-service',
  developers_service: 'developers-service',
  locations_service: 'locations-service',
};

export const KAFKA_PROPERTIES_TOPIC = {
  add_properties: 'add_properties',
  update_properties: 'update_properties',
  retrieve_properties: 'retrieve_properties',
  delete_properties: 'delete_properties',
  update_property_status: 'update_property_status',
};

export const KAFKA_LOCATIONS_TOPIC = {
  locations_autocomplete: 'locations_autocomplete',
  restricted_location_auto_complete: 'restricted_location_auto_complete',
  retrieve_locations: 'retrieve_locations',
  locations_details: 'locations_details',
  locations_geocode: 'locations_geocode',
};
