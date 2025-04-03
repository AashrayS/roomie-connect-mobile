
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { listingService } from '../services/listingService';
import { Listing, ListingFilters } from '../types/listing';
import { useToast } from '@/hooks/use-toast';

interface ListingContextType {
  listings: Listing[];
  userListings: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  filters: ListingFilters;
  fetchListings: (filters?: ListingFilters) => Promise<void>;
  fetchUserListings: () => Promise<void>;
  getListingById: (id: string) => Promise<Listing>;
  createListing: (listing: Omit<Listing, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Listing>;
  updateListing: (id: string, listing: Partial<Listing>) => Promise<Listing>;
  deleteListing: (id: string) => Promise<void>;
  toggleAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  saveListing: (id: string) => Promise<void>;
  removeSavedListing: (id: string) => Promise<void>;
  getSavedListings: () => Promise<Listing[]>;
  setFilters: (filters: ListingFilters) => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export function ListingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ListingFilters>({});

  const fetchListings = async (newFilters?: ListingFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listingService.getListings(newFilters || filters);
      setListings(data);
    } catch (error) {
      setError('Failed to fetch listings');
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserListings = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await listingService.getUserListings(user.id);
      setUserListings(data);
    } catch (error) {
      setError('Failed to fetch user listings');
      toast({
        title: "Error",
        description: "Failed to fetch your listings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getListingById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const listing = await listingService.getListingById(id);
      setCurrentListing(listing);
      return listing;
    } catch (error) {
      setError('Failed to fetch listing');
      toast({
        title: "Error",
        description: "Failed to fetch listing details",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createListing = async (listingData: Omit<Listing, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      const newListing = await listingService.createListing({
        ...listingData,
        userId: user.id,
        userName: user.name || 'Anonymous User',
        userPhone: user.phone,
        userEmail: user.email,
        userContactVisibility: user.contactVisibility || {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true,
        },
      });
      setUserListings(prev => [...prev, newListing]);
      toast({
        title: "Success",
        description: "Listing created successfully"
      });
      return newListing;
    } catch (error) {
      setError('Failed to create listing');
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateListing = async (id: string, listingData: Partial<Listing>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedListing = await listingService.updateListing(id, listingData);
      setUserListings(prev =>
        prev.map(listing => (listing.id === id ? updatedListing : listing))
      );
      if (currentListing?.id === id) {
        setCurrentListing(updatedListing);
      }
      toast({
        title: "Success",
        description: "Listing updated successfully"
      });
      return updatedListing;
    } catch (error) {
      setError('Failed to update listing');
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteListing = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await listingService.deleteListing(id);
      setUserListings(prev => prev.filter(listing => listing.id !== id));
      if (currentListing?.id === id) {
        setCurrentListing(null);
      }
      toast({
        title: "Success",
        description: "Listing deleted successfully"
      });
    } catch (error) {
      setError('Failed to delete listing');
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (id: string, isAvailable: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedListing = await listingService.toggleAvailability(id, isAvailable);
      setUserListings(prev =>
        prev.map(listing => (listing.id === id ? updatedListing : listing))
      );
      if (currentListing?.id === id) {
        setCurrentListing(updatedListing);
      }
      toast({
        title: "Success",
        description: `Listing marked as ${isAvailable ? 'available' : 'unavailable'}`
      });
    } catch (error) {
      setError('Failed to update availability');
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveListing = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      await listingService.saveListing(id, user.id);
      toast({
        title: "Success",
        description: "Listing saved successfully"
      });
    } catch (error) {
      setError('Failed to save listing');
      toast({
        title: "Error",
        description: "Failed to save listing",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedListing = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      await listingService.removeSavedListing(id, user.id);
      toast({
        title: "Success",
        description: "Listing removed from saved items"
      });
    } catch (error) {
      setError('Failed to remove saved listing');
      toast({
        title: "Error",
        description: "Failed to remove saved listing",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedListings = async () => {
    if (!user) throw new Error('User not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      const savedListings = await listingService.getSavedListings(user.id);
      return savedListings;
    } catch (error) {
      setError('Failed to fetch saved listings');
      toast({
        title: "Error",
        description: "Failed to fetch saved listings",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  return (
    <ListingContext.Provider
      value={{
        listings,
        userListings,
        currentListing,
        isLoading,
        error,
        filters,
        fetchListings,
        fetchUserListings,
        getListingById,
        createListing,
        updateListing,
        deleteListing,
        toggleAvailability,
        saveListing,
        removeSavedListing,
        getSavedListings,
        setFilters,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingProvider');
  }
  return context;
}
