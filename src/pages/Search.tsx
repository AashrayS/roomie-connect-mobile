
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";
import { Input } from "@/components/ui/input";

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
  {
    id: "4",
    title: "Luxury Apartment in Whitefield",
    location: "Whitefield, Bengaluru",
    rent: 20000,
    roommates: 2,
    gender: "any" as const,
    amenities: ["WiFi", "AC", "Gym", "Swimming Pool", "Parking"],
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    available: true,
  },
  {
    id: "5",
    title: "Student PG in BTM Layout",
    location: "BTM Layout 2nd Stage, Bengaluru",
    rent: 7000,
    roommates: 2,
    gender: "male" as const,
    amenities: ["WiFi", "Food", "Laundry"],
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    available: true,
  },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    minRent: 0,
    maxRent: 50000,
    gender: "any",
    amenities: [] as string[],
    available: false,
  });

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const filteredListings = MOCK_LISTINGS.filter((listing) => {
    // Search query filter
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Budget filter
    const matchesBudget =
      listing.rent >= activeFilters.minRent && listing.rent <= activeFilters.maxRent;

    // Gender filter
    const matchesGender =
      activeFilters.gender === "any" || listing.gender === activeFilters.gender || listing.gender === "any";

    // Availability filter
    const matchesAvailability = activeFilters.available ? listing.available : true;

    // Amenities filter
    const matchesAmenities =
      activeFilters.amenities.length === 0 ||
      activeFilters.amenities.every((amenity) =>
        listing.amenities.map(a => a.toLowerCase()).includes(amenity.toLowerCase())
      );

    return (
      matchesSearch &&
      matchesBudget &&
      matchesGender &&
      matchesAvailability &&
      matchesAmenities
    );
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

        <div className="grid grid-cols-1 gap-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No listings match your search criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
