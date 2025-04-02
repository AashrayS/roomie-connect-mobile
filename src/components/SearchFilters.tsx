
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: FiltersProps) => {
  const [filters, setFilters] = useState({
    minRent: 5000,
    maxRent: 25000,
    gender: "any",
    location: "",
    amenities: [] as string[],
    available: true,
  });

  const amenitiesOptions = [
    { id: "wifi", label: "WiFi" },
    { id: "furnished", label: "Furnished" },
    { id: "ac", label: "AC" },
    { id: "geyser", label: "Geyser" },
    { id: "parking", label: "Parking" },
    { id: "gym", label: "Gym" },
  ];
  
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const updatedAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return {
        ...prev,
        amenities: updatedAmenities
      };
    });
  };

  const applyFilters = () => {
    onFiltersChange(filters);
  };

  const resetFilters = () => {
    setFilters({
      minRent: 5000,
      maxRent: 25000,
      gender: "any",
      location: "",
      amenities: [],
      available: true,
    });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Filter Listings</DrawerTitle>
          <DrawerDescription>
            Find the perfect flatsharing option that suits your preferences.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-medium mb-2">Budget Range</h3>
            <div className="flex justify-between mb-2">
              <span>₹{filters.minRent}</span>
              <span>₹{filters.maxRent}</span>
            </div>
            <Slider
              value={[filters.minRent, filters.maxRent]}
              min={5000}
              max={50000}
              step={500}
              onValueChange={(value) => {
                setFilters({ ...filters, minRent: value[0], maxRent: value[1] });
              }}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Gender Preference</h3>
            <RadioGroup
              value={filters.gender}
              onValueChange={(value) => setFilters({ ...filters, gender: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any">Any</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesOptions.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={filters.amenities.includes(amenity.id)}
                    onCheckedChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <Label htmlFor={amenity.id}>{amenity.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Listing Status</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={filters.available}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, available: !!checked })
                }
              />
              <Label htmlFor="available">Show only available listings</Label>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Reset Filters
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchFilters;
