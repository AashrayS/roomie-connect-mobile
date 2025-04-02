
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/types/supabase";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [activeFilters, setActiveFilters] = useState({
    minRent: 0,
    maxRent: 50000,
    gender: "any",
    amenities: [] as string[],
    available: false,
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching listings",
          description: error.message || "Failed to fetch listings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [toast]);

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const filteredListings = listings.filter((listing) => {
    // Search query filter
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Budget filter
    const matchesBudget =
      listing.rent >= activeFilters.minRent && listing.rent <= activeFilters.maxRent;

    // Gender filter
    const matchesGender =
      activeFilters.gender === "any" || 
      listing.gender_preference === activeFilters.gender || 
      listing.gender_preference === "any" || 
      listing.gender_preference === null;

    // Availability filter
    const matchesAvailability = activeFilters.available ? listing.is_available : true;

    // Amenities filter
    const matchesAmenities =
      activeFilters.amenities.length === 0 ||
      activeFilters.amenities.every((amenity) =>
        (listing.amenities || []).map(a => a.toLowerCase()).includes(amenity.toLowerCase())
      );

    return (
      matchesSearch &&
      matchesBudget &&
      matchesGender &&
      matchesAvailability &&
      matchesAmenities
    );
  });

  const convertListingToCardProps = (listing: Listing) => ({
    id: listing.id,
    title: listing.title,
    location: listing.location,
    rent: listing.rent,
    roommates: listing.roommates_needed,
    gender: listing.gender_preference as any || "any",
    amenities: listing.amenities || [],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
    available: listing.is_available,
  });

  return (
    <div className="pb-20">
      <div className="px-4 py-4 bg-primary/5 border-b border-border sticky top-0 z-10 bg-background">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search locations or keywords..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <SearchFilters onFiltersChange={handleFiltersChange} />
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Search Results</h2>
          <span className="text-sm text-muted-foreground">
            {filteredListings.length} listings found
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} {...convertListingToCardProps(listing)} />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No listings match your search criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
