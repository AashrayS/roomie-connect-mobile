
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
    console.log("Fetching listings with limit:", limit);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching listings:", error.message);
      throw new Error(error.message);
    }
    
    console.log(`Found ${data?.length || 0} listings`);
    return data as Listing[];
  },

  async createSampleListings(): Promise<void> {
    try {
      // Force reset of sample data for development purposes
      const forceReset = false; // Set to true when you want to recreate sample data
      
      if (forceReset) {
        // First count how many listings exist
        const { count, error: countError } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true });
        
        // If listings exist, delete them (for development purposes only)
        if (count && count > 0) {
          console.log("Removing existing listings for reset");
          const { error: deleteError } = await supabase
            .from('listings')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
          
          if (deleteError) {
            console.error("Error deleting listings:", deleteError.message);
            return;
          }
        }
      }
      
      // Check current count after potential reset
      const { count, error: countError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error checking listings count:", countError.message);
        return;
      }
      
      // Always add sample listings regardless of existing count
      console.log(`${count || 0} listings found, adding sample data`);
      
      // Generate a unique user ID for the sample listings
      // This will ensure we're not violating the RLS policies when inserting
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData?.session?.user?.id || '00000000-0000-0000-0000-000000000000';
      console.log("Using user ID for sample data:", userId);
      
      const sampleListings = [
        {
          user_id: userId, // Use actual user ID or fallback
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
        },
        // Adding more sample data
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Elegant 3BHK in Jayanagar',
          description: 'Spacious apartment in a quiet neighborhood with great connectivity.',
          location: 'Jayanagar, Bengaluru',
          rent: 30000,
          roommates_needed: 2,
          gender_preference: 'any',
          amenities: ['WiFi', 'AC', 'Furnished', 'Power Backup', 'Security'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Studio Apartment in BTM Layout',
          description: 'Compact and fully furnished studio apartment for singles.',
          location: 'BTM Layout, Bengaluru',
          rent: 15000,
          roommates_needed: 1,
          gender_preference: 'any',
          amenities: ['WiFi', 'Furnished', 'Power Backup'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Sharing Apartment near Manyata Tech Park',
          description: 'Perfect for IT professionals working in Manyata Tech Park.',
          location: 'Hebbal, Bengaluru',
          rent: 10000,
          roommates_needed: 2,
          gender_preference: 'male',
          amenities: ['WiFi', 'AC', 'Furnished', 'Transport'],
          is_available: true
        },
        {
          user_id: '00000000-0000-0000-0000-000000000000',
          title: 'Luxury Villa in Electronic City',
          description: 'Spacious 5BHK villa with premium amenities in gated community.',
          location: 'Electronic City, Bengaluru',
          rent: 55000,
          roommates_needed: 3,
          gender_preference: 'any',
          amenities: ['WiFi', 'AC', 'Furnished', 'Swimming Pool', 'Gym', 'Garden', 'Parking'],
          is_available: true
        }
      ];
      
      // Update all sample listings to use the correct user ID
      const updatedSampleListings = sampleListings.map(listing => ({
        ...listing,
        user_id: userId
      }));
      
      // Insert using role key if available for bypassing RLS
      const { error: insertError } = await supabase
        .from('listings')
        .insert(updatedSampleListings as Database['public']['Tables']['listings']['Insert'][])
        .select();
      
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
