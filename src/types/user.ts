
export type Gender = 'male' | 'female' | 'other';

export type Profession = 'student' | 'working_professional';

export interface LifestylePreferences {
  smoking: boolean;
  pets: boolean;
  drinking?: boolean;
  foodHabits?: string;
  workFromHome: boolean;
  nightOwl: boolean;
  earlyBird: boolean;
  social: boolean;
  quiet: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  phone_number?: string; // For compatibility with database fields
  email: string;
  gender?: Gender;
  profession?: Profession;
  contactVisibility: {
    showPhone: boolean;
    showEmail: boolean;
    showWhatsApp: boolean;
  };
  bio?: string;
  preferences?: {
    genderPreference: 'male' | 'female' | 'any';
    maxRent?: number;
    preferredLocations?: string[];
    smoking?: boolean;
    pets?: boolean;
    drinking?: boolean;
    foodHabits?: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    whatsappNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
