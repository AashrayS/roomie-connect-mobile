
import { useState, useEffect } from "react";
import { ChevronRight, Search } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Modern PG in Koramangala",
    location: "Koramangala 5th Block, Bengaluru",
    rent: 12000,
    roommates: 2,
    gender: "male" as const,
    amenities: ["WiFi", "AC", "Furnished"],
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    available: true,
  },
  {
    id: "2",
    title: "Spacious Flat in HSR Layout",
    location: "HSR Layout Sector 2, Bengaluru",
    rent: 15000,
    roommates: 1,
    gender: "any" as const,
    amenities: ["WiFi", "Geyser", "Parking", "Gym"],
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    available: true,
  },
  {
    id: "3",
    title: "Budget-friendly PG near Indiranagar",
    location: "Indiranagar 100ft Road, Bengaluru",
    rent: 8000,
    roommates: 3,
    gender: "female" as const,
    amenities: ["Furnished", "WiFi", "AC", "Food"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    available: false,
  },
];

const Home = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // This would normally be an API call
    toast({
      title: "Welcome to Flatmate Finder!",
      description: "Find your perfect living space and flatmates.",
    });
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
        <div className="grid grid-cols-1 gap-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No listings found. Try a different search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
