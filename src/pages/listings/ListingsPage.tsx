import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../../contexts/ListingContext';
import { ListingFilters } from '../../types/listing';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import { MapPin, Users, IndianRupee, Filter, Plus } from 'lucide-react';

export function ListingsPage() {
  const { listings, isLoading, filters, setFilters, fetchListings } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilterChange = (newFilters: Partial<ListingFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would implement search functionality
    // For now, we'll just filter the listings client-side
    fetchListings();
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const renderListingCard = (listing: any) => (
    <Link to={`/listings/${listing.id}`} key={listing.id}>
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>{listing.title}</CardTitle>
          <CardDescription className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {listing.location.address}, {listing.location.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-2">{listing.description.substring(0, 100)}...</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <IndianRupee className="h-4 w-4 mr-1" />
              <span>{listing.rentAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{listing.numberOfFlatmates} flatmates</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <span className={`text-xs px-2 py-1 rounded ${listing.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {listing.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(listing.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="mb-4">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Find Your Perfect Flatmate</h1>
        <Link to="/listings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by location, amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rent Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minRent || ''}
                    onChange={(e) => handleFilterChange({ minRent: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxRent || ''}
                    onChange={(e) => handleFilterChange({ maxRent: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Enter city"
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange({ city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender Preference</Label>
                <Select
                  value={filters.genderPreference || ''}
                  onValueChange={(value) => handleFilterChange({ genderPreference: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number of Flatmates</Label>
                <Select
                  value={filters.numberOfFlatmates?.toString() || ''}
                  onValueChange={(value) => handleFilterChange({ numberOfFlatmates: value ? Number(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of flatmates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={filters.isAvailable !== false}
                  onCheckedChange={(checked) => handleFilterChange({ isAvailable: checked })}
                />
                <Label htmlFor="available">Show only available listings</Label>
              </div>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="my">My Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? renderSkeleton() : listings.map(renderListingCard)}
          {!isLoading && listings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No listings found. Try adjusting your filters.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="my">
          {/* My listings tab content will be implemented later */}
          <div className="text-center py-8">
            <p className="text-gray-500">My listings feature coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 