
import { Listing, ListingFilters } from '../types/listing';
import { supabase } from '../lib/supabase';

class ListingService {
  private readonly table = 'listings';
  private readonly savedTable = 'saved_listings';

  async getListings(filters?: ListingFilters, limit: number = 10): Promise<Listing[]> {
    let query = supabase.from(this.table).select('*');

    if (filters) {
      if (filters.minRent) {
        query = query.gte('rent_amount', filters.minRent);
      }
      if (filters.maxRent) {
        query = query.lte('rent_amount', filters.maxRent);
      }
      if (filters.city) {
        query = query.eq('location->city', filters.city);
      }
      if (filters.genderPreference) {
        query = query.eq('gender_preference', filters.genderPreference);
      }
      if (filters.numberOfFlatmates) {
        query = query.eq('number_of_flatmates', filters.numberOfFlatmates);
      }
    }

    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error.message);
      throw new Error(error.message);
    }

    console.log(`Found ${data?.length || 0} listings`);
    return data.map(this.mapListingFromDb);
  }

  async getUserListings(userId: string): Promise<Listing[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapListingFromDb);
  }

  async getListingById(id: string): Promise<Listing> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapListingFromDb(data);
  }

  async createListing(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const { data, error } = await supabase
      .from(this.table)
      .insert({
        user_id: listing.userId,
        user_name: listing.userName,
        user_phone: listing.userPhone,
        user_email: listing.userEmail,
        user_contact_visibility: listing.userContactVisibility,
        title: listing.title,
        description: listing.description,
        location: listing.location,
        rent_amount: listing.rentAmount,
        number_of_flatmates: listing.numberOfFlatmates,
        gender_preference: listing.genderPreference,
        amenities: listing.amenities,
        is_available: listing.isAvailable,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapListingFromDb(data);
  }

  async updateListing(id: string, listing: Partial<Listing>): Promise<Listing> {
    const { data, error } = await supabase
      .from(this.table)
      .update({
        title: listing.title,
        description: listing.description,
        location: listing.location,
        rent_amount: listing.rentAmount,
        number_of_flatmates: listing.numberOfFlatmates,
        gender_preference: listing.genderPreference,
        amenities: listing.amenities,
        is_available: listing.isAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapListingFromDb(data);
  }

  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async toggleAvailability(id: string, isAvailable: boolean): Promise<Listing> {
    const { data, error } = await supabase
      .from(this.table)
      .update({
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapListingFromDb(data);
  }

  async saveListing(listingId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(this.savedTable)
      .insert({
        listing_id: listingId,
        user_id: userId,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  async removeSavedListing(listingId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(this.savedTable)
      .delete()
      .eq('listing_id', listingId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSavedListings(userId: string): Promise<Listing[]> {
    const { data: savedData, error: savedError } = await supabase
      .from(this.savedTable)
      .select('listing_id')
      .eq('user_id', userId);

    if (savedError) {
      throw new Error(savedError.message);
    }

    const listingIds = savedData.map(item => item.listing_id);
    const listings: Listing[] = [];

    for (const id of listingIds) {
      try {
        const listing = await this.getListingById(id);
        listings.push(listing);
      } catch (error) {
        console.error(`Error fetching saved listing ${id}:`, error);
      }
    }

    return listings;
  }

  async createSampleListings(): Promise<void> {
    try {
      // Check current count
      const { count, error: countError } = await supabase
        .from(this.table)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error checking listings count:", countError.message);
        return;
      }
      
      console.log(`${count || 0} listings found, adding sample data if needed`);
      
      // Get the current authenticated user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        console.log("No authenticated user found for sample data");
        return;
      }
      
      const sampleListings = [
        {
          userId: userId,
          userName: 'Sample User',
          userPhone: '+919876543210',
          userEmail: 'sample@example.com',
          userContactVisibility: {
            showPhone: true,
            showEmail: true,
            showWhatsApp: true
          },
          title: 'Cozy 3BHK in Koramangala',
          description: 'Spacious apartment with great amenities located in the heart of Koramangala.',
          location: {
            address: '123, 5th Cross',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560034'
          },
          rentAmount: 25000,
          numberOfFlatmates: 2,
          genderPreference: 'any' as const,
          amenities: {
            wifi: true,
            ac: true,
            kitchen: true,
            laundry: true,
            parking: true,
            furnished: true
          },
          isAvailable: true
        },
        // Add more sample listings as needed
      ];

      for (const listing of sampleListings) {
        try {
          await this.createListing(listing);
          console.log("Created sample listing:", listing.title);
        } catch (error) {
          console.error("Error creating sample listing:", error);
        }
      }
    } catch (error) {
      console.error("Error in createSampleListings:", error);
    }
  }

  private mapListingFromDb(data: any): Listing {
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userPhone: data.user_phone,
      userEmail: data.user_email,
      userContactVisibility: data.user_contact_visibility || {
        showPhone: true,
        showEmail: true,
        showWhatsApp: true,
      },
      title: data.title,
      description: data.description,
      location: data.location,
      rentAmount: data.rent_amount,
      numberOfFlatmates: data.number_of_flatmates,
      genderPreference: data.gender_preference,
      amenities: data.amenities,
      isAvailable: data.is_available,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const listingService = new ListingService();
