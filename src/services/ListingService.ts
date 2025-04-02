
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/types/supabase";

export const ListingService = {
  async createListing(listing: Partial<Listing>): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
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
      .update(updates)
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
  }
};
