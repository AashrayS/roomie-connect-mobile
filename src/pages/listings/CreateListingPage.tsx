import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../../contexts/ListingContext';
import { Listing } from '../../types/listing';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { MapPin, Users, IndianRupee, ArrowLeft } from 'lucide-react';

export function CreateListingPage() {
  const navigate = useNavigate();
  const { createListing } = useListings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Listing>>({
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      latitude: 0,
      longitude: 0,
    },
    rentAmount: 0,
    numberOfFlatmates: 1,
    genderPreference: 'any',
    amenities: {
      furnished: false,
      wifi: false,
      parking: false,
      laundry: false,
      kitchen: false,
      airConditioning: false,
      heating: false,
      balcony: false,
      security: false,
      gym: false,
      pool: false,
    },
    isAvailable: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location!,
          [locationField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity: keyof Listing['amenities']) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities!,
        [amenity]: !prev.amenities![amenity],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createListing(formData as Listing);
      navigate('/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      // In a real app, we would show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle>Create New Listing</CardTitle>
          <CardDescription>Fill in the details about your property listing</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Cozy 2BHK in Koramangala"
                value={formData.title}
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
                value={formData.description}
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
                    value={formData.location?.address}
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
                    value={formData.location?.city}
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
                    value={formData.location?.state}
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
                    value={formData.location?.postalCode}
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
                    value={formData.rentAmount}
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
                    value={formData.numberOfFlatmates}
                    onChange={handleNumberChange}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genderPreference">Gender Preference</Label>
                <Select
                  value={formData.genderPreference}
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
                {Object.entries(formData.amenities || {}).map(([key, value]) => (
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
              onClick={() => navigate('/listings')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 