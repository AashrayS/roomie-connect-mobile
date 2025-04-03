
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type Profession = 'student' | 'professional' | 'self-employed' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: Gender;
  profession?: Profession;
  bio?: string;
  contactVisibility?: {
    showPhone: boolean;
    showEmail: boolean;
    showWhatsApp: boolean;
  };
  notificationSettings?: {
    newMessages: boolean;
    newMatches: boolean;
    marketing: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}
