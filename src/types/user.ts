
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type Profession = 'student' | 'professional' | 'self-employed' | 'other';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LifestylePreferences {
  smoking: boolean;
  pets: boolean;
  workFromHome: boolean;
  nightOwl: boolean;
  earlyBird: boolean;
  social: boolean;
  quiet: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phone_number?: string;
  gender?: Gender;
  profession?: Profession;
  bio?: string;
  contactVisibility?: {
    showPhone: boolean;
    showEmail: boolean;
    showWhatsApp: boolean;
  };
  preferences?: {
    genderPreference?: 'male' | 'female' | 'any';
    lifestyle?: LifestylePreferences;
  };
  notificationSettings?: {
    newMessages: boolean;
    newMatches: boolean;
    marketing: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    whatsappNotifications?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}
