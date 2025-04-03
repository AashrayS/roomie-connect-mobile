import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/contexts/ListingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

function CreateListingPage() {
  const { createListing } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
    },
    rentAmount: 0,
    numberOfFlatmates: 1,
    genderPreference: 'any' as 'male' | 'female' | 'any',
    amenities: {
      wifi: false,
      ac: false,
      kitchen: false,
      laundry: false,
      parking: false,
      furnished: false,
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: value
      }
    });
  };

  const handleAmenityToggle = (amenity: keyof typeof formData.amenities) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.location.address || !formData.rentAmount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a listing",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      setIsSubmitting(true);

      await createListing({
        ...formData,
        userName: user.name || 'Anonymous',
        userPhone: user.phone,
        userEmail: user.email,
        userContactVisibility: {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true
        },
        isAvailable: true,
      });
      
      toast({
        title: "Listing created!",
        description: "Your listing has been successfully created"
      });
      
      navigate("/listings");
    } catch (error: any) {
      toast({
        title: "Error creating listing",
        description: error.message || "An error occurred while creating the listing",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="p-4 bg-primary/5 border-b border-border">
        <h1 className="text-2xl font-bold">Create New Listing</h1>
        <p className="text-muted-foreground">
          Add details about your available flatshare
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Listing Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Modern 3BHK in Koramangala"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Location *</Label>
          <Input
            id="address"
            name="address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleLocationChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleLocationChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              placeholder="State"
              value={formData.location.state}
              onChange={handleLocationChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.location.postalCode}
            onChange={handleLocationChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rentAmount">Monthly Rent (₹) *</Label>
            <Input
              id="rentAmount"
              name="rentAmount"
              type="number"
              placeholder="e.g., 10000"
              value={formData.rentAmount || ''}
              onChange={(e) => setFormData({...formData, rentAmount: parseInt(e.target.value) || 0})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfFlatmates">Number of Flatmates Needed *</Label>
            <Input
              id="numberOfFlatmates"
              name="numberOfFlatmates"
              type="number"
              placeholder="e.g., 1"
              value={formData.numberOfFlatmates}
              onChange={(e) => setFormData({...formData, numberOfFlatmates: parseInt(e.target.value) || 1})}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Gender Preference *</Label>
          <RadioGroup
            value={formData.genderPreference}
            onValueChange={(value: 'male' | 'female' | 'any') => setFormData({ ...formData, genderPreference: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any" />
              <Label htmlFor="any">No preference</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Available Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wifi"
                checked={formData.amenities.wifi}
                onCheckedChange={() => handleAmenityToggle('wifi')}
              />
              <Label htmlFor="wifi">WiFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ac"
                checked={formData.amenities.ac}
                onCheckedChange={() => handleAmenityToggle('ac')}
              />
              <Label htmlFor="ac">AC</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kitchen"
                checked={formData.amenities.kitchen}
                onCheckedChange={() => handleAmenityToggle('kitchen')}
              />
              <Label htmlFor="kitchen">Kitchen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="laundry"
                checked={formData.amenities.laundry}
                onCheckedChange={() => handleAmenityToggle('laundry')}
              />
              <Label htmlFor="laundry">Laundry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parking"
                checked={formData.amenities.parking}
                onCheckedChange={() => handleAmenityToggle('parking')}
              />
              <Label htmlFor="parking">Parking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="furnished"
                checked={formData.amenities.furnished}
                onCheckedChange={() => handleAmenityToggle('furnished')}
              />
              <Label htmlFor="furnished">Furnished</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Add more details about your place, rules, preferences, etc."
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Listing"}
        </Button>
      </form>
    </div>
  );
}

export { CreateListingPage };
