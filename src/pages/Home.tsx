
import { useState, useEffect } from "react";
import { ChevronRight, Search } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Listing } from "@/types/supabase";
import { listingService } from "@/services/listingService";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        await ListingService.createSampleListings();
        const data = await ListingService.getListings();
        setListings(data);
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

  const filteredListings = listings.filter(
    listing =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLocations = [
    "Koramangala",
    "HSR Layout",
    "Indiranagar",
    "Electronic City"
  ];

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
      <div className="px-4 py-6 bg-primary/5 border-b border-border">
        <h1 className="text-2xl font-bold mb-2">Find Your Perfect Flatshare</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by location or keyword..."
            className="pl-10 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Popular Locations</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/search" className="text-primary flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {popularLocations.map((location) => (
            <Button
              key={location}
              variant="outline"
              className="flex-shrink-0 snap-start"
              onClick={() => setSearchQuery(location)}
            >
              {location}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Listings</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/search" className="text-primary flex items-center">
              See all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...convertListingToCardProps(listing)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 rounded-lg bg-background border border-border">
                <div className="text-5xl mb-3">🏠</div>
                <h3 className="text-lg font-medium text-foreground mb-1">No listings found</h3>
                <p className="text-muted-foreground mb-4">Try a different search query or check back later</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
