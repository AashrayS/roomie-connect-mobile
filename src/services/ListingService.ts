import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/types/supabase";
import { Database } from "@/integrations/supabase/types";

export const ListingService = {
  async createListing(listing: Partial<Listing>): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing as Database['public']['Tables']['listings']['Insert']])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Listing;
  },
  
  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .update(updates as Database['public']['Tables']['listings']['Update'])
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Listing;
  },
  
  async getListingById(id: string): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Listing;
  },
  
  async deleteListingById(id: string): Promise<void> {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  },
  
  async getListings(limit: number = 10): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Listing[];
  },

  async createSampleListings(): Promise<void> {
    try {
      // Check current count first
      const { count, error: countError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error checking listings count:", countError.message);
        return;
      }
      
      // If we already have listings, don't add more samples
      if (count && count > 0) {
        console.log(`${count} listings already exist, skipping sample data creation`);
        return;
      }
      
      console.log("No listings found, creating sample data");
      
      const sampleListings = [
        {
          user_id: '00000000-0000-0000-0000-000000000000', // Default user ID for sample data
          title: 'Cozy 3BHK in Koramangala',
          description: 'Spacious apartment with great amenities located in the heart of Koramangala.',
          location: 'Koramangala, Bengaluru',
          rent: 25000,
          roommates_needed: 2,
          gender_preference: 'any',
          amenities: ['WiFi', 'AC', 'Furnished', 'Parking'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000', // Default user ID for sample data
          title: 'Modern 2BHK in HSR Layout',
          description: 'Modern apartment with all facilities in a gated community.',
          location: 'HSR Layout, Bengaluru',
          rent: 18000,
          roommates_needed: 1,
          gender_preference: 'male',
          amenities: ['WiFi', 'AC', 'Gym', 'Security'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000', // Default user ID for sample data
          title: 'Luxury Apartment in Indiranagar',
          description: 'Premium 3BHK apartment close to metro station and restaurants.',
          location: 'Indiranagar, Bengaluru',
          rent: 35000,
          roommates_needed: 2,
          gender_preference: 'female',
          amenities: ['WiFi', 'AC', 'Furnished', 'Swimming Pool', 'Gym'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Spacious 4BHK Villa in Whitefield',
          description: 'Large villa with garden, perfect for professionals or families.',
          location: 'Whitefield, Bengaluru',
          rent: 45000,
          roommates_needed: 3,
          gender_preference: 'any',
          amenities: ['WiFi', 'AC', 'Furnished', 'Garden', 'Parking', 'Security'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Budget 1BHK in Marathahalli',
          description: 'Affordable and comfortable apartment near IT hub.',
          location: 'Marathahalli, Bengaluru',
          rent: 12000,
          roommates_needed: 1,
          gender_preference: 'male',
          amenities: ['WiFi', 'Furnished', 'Parking'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Premium Studio in JP Nagar',
          description: 'Modern studio apartment with all amenities in a prime location.',
          location: 'JP Nagar, Bengaluru',
          rent: 22000,
          roommates_needed: 1,
          gender_preference: 'female',
          amenities: ['WiFi', 'AC', 'Gym', 'Swimming Pool', 'Security'],
          is_available: true
        }
      ];
      
      // Insert using service_role key if available for bypassing RLS
      // For sample data only - otherwise we'd need proper authentication
      const { error: insertError } = await supabase
        .from('listings')
        .insert(sampleListings as Database['public']['Tables']['listings']['Insert'][]);
      
      if (insertError) {
        console.error("Failed to insert sample listings:", insertError.message);
        throw new Error(insertError.message);
      } else {
        console.log("Sample listings created successfully");
      }
    } catch (error: any) {
      console.error("Error in createSampleListings:", error.message);
      // Don't throw the error here, just log it to prevent breaking the app flow
    }
  }
};
