
import { Gender } from './user';

export interface Location {
  latitude?: number;
  longitude?: number;
  address: string;
  city: string;
  state: string;
  country?: string;
  postalCode: string;
}

export interface Amenities {
  isFurnished?: boolean;
  hasWifi?: boolean;
  hasParking?: boolean;
  hasLaundry?: boolean;
  hasKitchen?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  hasBalcony?: boolean;
  hasSecurity?: boolean;
  hasGym?: boolean;
  hasPool?: boolean;
  wifi: boolean;
  ac: boolean;
  kitchen: boolean;
  laundry: boolean;
  parking: boolean;
  furnished: boolean;
}

export interface UserContactVisibility {
  showPhone: boolean;
  showEmail: boolean;
  showWhatsApp: boolean;
}

export interface Listing {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  userContactVisibility?: {
    showPhone: boolean;
    showEmail: boolean;
    showWhatsApp: boolean;
  };
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  rentAmount: number;
  numberOfFlatmates: number;
  genderPreference: 'male' | 'female' | 'any';
  amenities: {
    wifi: boolean;
    ac: boolean;
    kitchen: boolean;
    laundry: boolean;
    parking: boolean;
    furnished: boolean;
  };
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  minRent?: number;
  maxRent?: number;
  city?: string;
  genderPreference?: 'male' | 'female' | 'any';
  numberOfFlatmates?: number;
  isAvailable?: boolean;
  amenities?: {
    wifi?: boolean;
    ac?: boolean;
    kitchen?: boolean;
    laundry?: boolean;
    parking?: boolean;
    furnished?: boolean;
  };
} 
