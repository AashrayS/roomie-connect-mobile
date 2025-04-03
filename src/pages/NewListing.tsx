import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { listingService } from "@/services/listingService";

const NewListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent: "",
    deposit: "",
    roommates: "1",
    gender: "any",
    description: "",
    amenities: [] as string[]
  });

  const amenitiesOptions = [
    { id: "wifi", label: "WiFi" },
    { id: "ac", label: "AC" },
    { id: "furnished", label: "Furnished" },
    { id: "geyser", label: "Geyser" },
    { id: "parking", label: "Parking" },
    { id: "food", label: "Food Included" },
    { id: "gym", label: "Gym Access" },
    { id: "tv", label: "TV" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const updatedAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return {
        ...prev,
        amenities: updatedAmenities
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.location || !formData.rent) {
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

      const newListing = {
        userId: user.id,
        userName: user.name || 'Anonymous',
        userPhone: user.phone,
        userEmail: user.email,
        userContactVisibility: {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true
        },
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.location,
          city: "", // Would need to parse from location or add separate field
          state: "", // Would need to parse from location or add separate field
          postalCode: "" // Would need to parse from location or add separate field
        },
        rentAmount: parseInt(formData.rent, 10),
        numberOfFlatmates: parseInt(formData.roommates, 10),
        genderPreference: formData.gender as 'male' | 'female' | 'any',
        amenities: {
          wifi: formData.amenities.includes("wifi"),
          ac: formData.amenities.includes("ac"),
          kitchen: false, // Not in form, default value
          laundry: false, // Not in form, default value
          parking: formData.amenities.includes("parking"),
          furnished: formData.amenities.includes("furnished")
        },
        isAvailable: true
      };

      await listingService.createListing(newListing);
      
      toast({
        title: "Listing created!",
        description: "Your listing has been successfully created"
      });
      
      navigate("/");
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
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Koramangala 5th Block, Bengaluru"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent (₹) *</Label>
            <Input
              id="rent"
              name="rent"
              type="number"
              placeholder="e.g., 10000"
              value={formData.rent}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit">Security Deposit (₹)</Label>
            <Input
              id="deposit"
              name="deposit"
              type="number"
              placeholder="e.g., 20000"
              value={formData.deposit}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Number of Flatmates Needed *</Label>
          <RadioGroup
            defaultValue="1"
            value={formData.roommates}
            onValueChange={(value) => setFormData({ ...formData, roommates: value })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">3</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4+" id="r4" />
              <Label htmlFor="r4">4+</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Gender Preference *</Label>
          <RadioGroup
            defaultValue="any"
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
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
            {amenitiesOptions.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={formData.amenities.includes(amenity.id)}
                  onCheckedChange={() => handleAmenityToggle(amenity.id)}
                />
                <Label htmlFor={amenity.id}>{amenity.label}</Label>
              </div>
            ))}
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

        <div className="space-y-2">
          <Label>Upload Photos</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center border-muted">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "Image upload will be available in the next update",
                });
              }}
            >
              Upload Images
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG or GIF, max 5MB each
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Listing"}
        </Button>
      </form>
    </div>
  );
};

export default NewListing;
