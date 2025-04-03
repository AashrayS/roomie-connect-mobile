import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../../contexts/ListingContext';
import { Listing } from '../../types/listing';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { MapPin, Users, IndianRupee, Bookmark, Trash2 } from 'lucide-react';

export function SavedListingsPage() {
  const { getSavedListings, removeSavedListing } = useListings();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedListings = async () => {
      try {
        const listings = await getSavedListings();
        setSavedListings(listings);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedListings();
  }, [getSavedListings]);

  const handleRemove = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to remove this listing from your saved items?')) return;

    setRemovingId(listingId);
    try {
      await removeSavedListing(listingId);
      setSavedListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error removing saved listing:', error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (savedListings.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium">No Saved Listings</h3>
            <p className="text-gray-500">You haven't saved any listings yet.</p>
            <Button asChild>
              <Link to="/listings">Browse Listings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedListings.map((listing) => (
        <Card key={listing.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location.address}, {listing.location.city}
                </CardDescription>
              </div>
              <Badge variant={listing.isAvailable ? 'default' : 'secondary'}>
                {listing.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-lg font-medium">{listing.rentAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-lg">{listing.numberOfFlatmates} flatmates</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg">Gender Preference: {listing.genderPreference}</span>
              </div>
            </div>

            <p className="text-gray-600 line-clamp-2">{listing.description}</p>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link to={`/listings/${listing.id}`}>View Details</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(listing.id)}
              disabled={removingId === listing.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 