import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../../contexts/ListingContext';
import { Listing } from '../../types/listing';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Skeleton } from '../../components/ui/skeleton';
import { MapPin, Users, IndianRupee, ArrowLeft } from 'lucide-react';

export function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListingById, updateListing } = useListings();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        // In a real app, we would show an error toast here
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, getListingById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setListing(prev => prev ? {
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      } : null);
    } else {
      setListing(prev => prev ? {
        ...prev,
        [name]: value,
      } : null);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setListing(prev => prev ? {
      ...prev,
      [name]: Number(value),
    } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setListing(prev => prev ? {
      ...prev,
      [name]: value,
    } : null);
  };

  const handleAmenityChange = (amenity: keyof Listing['amenities']) => {
    setListing(prev => prev ? {
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setIsSubmitting(true);
    try {
      await updateListing(listing.id, listing);
      navigate(`/listings/${listing.id}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      // In a real app, we would show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/listings')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/listings/${listing.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
          <CardDescription>Update your property listing details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Cozy 2BHK in Koramangala"
                value={listing.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your property and what you're looking for in a flatmate..."
                value={listing.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location.address">Address</Label>
                  <Input
                    id="location.address"
                    name="location.address"
                    placeholder="Street address"
                    value={listing.location.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location.city">City</Label>
                  <Input
                    id="location.city"
                    name="location.city"
                    placeholder="City"
                    value={listing.location.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location.state">State</Label>
                  <Input
                    id="location.state"
                    name="location.state"
                    placeholder="State"
                    value={listing.location.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location.postalCode">Postal Code</Label>
                  <Input
                    id="location.postalCode"
                    name="location.postalCode"
                    placeholder="Postal code"
                    value={listing.location.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Rent Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="rentAmount"
                    name="rentAmount"
                    type="number"
                    placeholder="0"
                    value={listing.rentAmount}
                    onChange={handleNumberChange}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfFlatmates">Number of Flatmates</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="numberOfFlatmates"
                    name="numberOfFlatmates"
                    type="number"
                    min="1"
                    max="10"
                    value={listing.numberOfFlatmates}
                    onChange={handleNumberChange}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genderPreference">Gender Preference</Label>
                <Select
                  value={listing.genderPreference}
                  onValueChange={(value) => handleSelectChange('genderPreference', value)}
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
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(listing.amenities).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={() => handleAmenityChange(key as keyof Listing['amenities'])}
                    />
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/listings/${listing.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 