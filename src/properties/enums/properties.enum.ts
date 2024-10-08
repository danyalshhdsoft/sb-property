export enum PROPERTY_PURPOSE {
  BUY = 'BUY', //Optional: This means property user can buy which is for-sale
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum PROPERTY_COMPLETION_STATUS {
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  READY = 'READY',
}

export enum PROPERTY_OWNERSHIP_STATUS {
  FREE_HOLD = 'FREE_HOLD',
  LEASE_HOLD = 'LEASE_HOLD',
}

export enum PROPERTY_PAID_BY {
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
}

export enum PROPERTY_LISTING_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATED_BY_USER = 'DEACTIVATED_BY_USER',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  EXPIRING_SOON = 'EXPIRING_SOON',
}

export enum PROPERTY_DOCUMENT_STATUS {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum PROPERTY_REVIEW_STATUS {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum PROPERTY_AS_PROJECT_TIMELINE {
  PROJECT_ANNOUNCEMENT = 'PROJECT_ANNOUNCEMENT',
  CONSTRUCTION_STARTED = 'CONSTRUCTION_STARTED',
  EXPECTED_COMPLETION = 'EXPECTED_COMPLETION',
}

export enum PROPERTY_RENTAL_FREQUENCY {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PROPERTY_RENTAL_PERIODS {
  THIRTY_DAYS = 'THIRTY_DAYS',
  FOURTY_FIVE_DAYS = 'FOURTY_FIVE_DAYS',
  SIXTY_DAYS = 'SIXTY_DAYS',
  NINETY_DAYS = 'NINETY_DAYS',
}

export enum FLOOR_PLAN_STATE {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

export enum PROPERTY_RENTAL_ROOM_TYPE {
  PARTITIONED_ROOM = 'PARTITIONED_ROOM',
  PRIVATE_ROOM = 'PRIVATE_ROOM',
  BED_SPACE_ROOM = 'BED_SPACE_ROOM',
}

export enum PROPERTY_OCCUPANCY_OPTION {
  VACANT = 'VACANT',
  RENTED = 'RENTED',
}

export enum PROPERTY_RESIDENCE_TYPES {
  SINGLE = 'SINGLE',
  FAMILY = 'FAMILY',
}

export enum PROPERTY_AVAILABILITY_STATUS {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

export enum PROPERTY_CONSTRUCTION_STATUS {
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  COMPLETED = 'COMPLETED',
}

export enum PROPERTY_VERFICATION_CHECK {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export enum PROPERTY_OFF_PLAN_SALE_TYPE {
  INITIAL_SALE = 'INITIAL_SALE',
  RESALE = 'RESALE',
}

export enum PROPERTY_TENANCY_WAY_OF_PAYMENT {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  CASH_AND_CHEQUE = 'CASH_AND_CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  COURT_DEPOSIT = 'COURT_DEPOSIT',
  REGISTERED_ACCOUNT = 'REGISTERED_ACCOUNT',
}
