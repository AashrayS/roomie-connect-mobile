
export type Profile = {
  id: string;
  name: string | null;
  phone_number: string | null;
  gender: string | null;
  profession: string | null;
  created_at: string;
  updated_at: string;
};

export type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string;
  rent: number;
  roommates_needed: number;
  gender_preference: string | null;
  amenities: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
};
