
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { listingService } from "@/services/listingService";
import { Listing, ListingFilters } from '@/types/listing';
import SearchFilters from '../components/SearchFilters';

interface FiltersProps {
  onSearch: (newFilters: ListingFilters) => void;
}

export function Search() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ListingFilters>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const data = await listingService.getListings(filters);
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        toast({
          title: "Error",
          description: "Failed to load listings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [filters, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Search Listings</h1>

      <SearchFilters onSearch={(newFilters) => setFilters(newFilters)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map(listing => (
          <Card key={listing.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-lg font-semibold">{listing.title}</h2>
              <p className="text-gray-600">Rent: ${listing.rentAmount}</p>
              <p className="text-gray-600">Location: {listing.location.city}, {listing.location.state}</p>
              <div className="mt-2">
                <Badge>{listing.genderPreference}</Badge>
              </div>
              <Button asChild className="mt-4">
                <Link to={`/listings/${listing.id}`}>View Details</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
