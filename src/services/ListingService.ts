import { Listing, ListingFilters } from '../types/listing';
import { supabase } from '../lib/supabase';

class ListingService {
  private readonly table = 'listings';
  private readonly savedTable = 'saved_listings';

  async getListings(filters?: ListingFilters): Promise<Listing[]> {
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

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
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

    if (error) throw error;
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

    if (error) throw error;
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

    if (error) throw error;
    return this.mapListingFromDb(data);
  }

  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
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

    if (error) throw error;
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

    if (error) throw error;
  }

  async removeSavedListing(listingId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(this.savedTable)
      .delete()
      .eq('listing_id', listingId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getSavedListings(userId: string): Promise<Listing[]> {
    const { data: savedData, error: savedError } = await supabase
      .from(this.savedTable)
      .select('listing_id')
      .eq('user_id', userId);

    if (savedError) throw savedError;

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
