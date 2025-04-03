
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ListingFilters } from '@/types/listing';

interface SearchFiltersProps {
  onSearch: (filters: ListingFilters) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<ListingFilters>({
    minRent: undefined,
    maxRent: undefined,
    city: '',
    genderPreference: undefined,
    isAvailable: true,
    amenities: {
      wifi: false,
      ac: false,
      kitchen: false,
      laundry: false,
      parking: false,
      furnished: false
    }
  });

  const handleChange = (key: keyof ListingFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityChange = (amenity: keyof NonNullable<ListingFilters['amenities']>, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: checked
      }
    }));
  };

  const handleApplyFilters = () => {
    onSearch(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      minRent: undefined,
      maxRent: undefined,
      city: '',
      genderPreference: undefined,
      isAvailable: true,
      amenities: {
        wifi: false,
        ac: false,
        kitchen: false,
        laundry: false,
        parking: false,
        furnished: false
      }
    });
    onSearch({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex space-x-4 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minRent || ''}
                onChange={(e) => handleChange('minRent', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxRent || ''}
                onChange={(e) => handleChange('maxRent', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              placeholder="Enter city"
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gender Preference</Label>
            <Select 
              value={filters.genderPreference || ''}
              onValueChange={(value) => handleChange('genderPreference', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 pt-6">
              <Switch 
                id="available"
                checked={!!filters.isAvailable}
                onCheckedChange={(checked) => handleChange('isAvailable', checked)}
              />
              <Label htmlFor="available">Show only available listings</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="block mb-2">Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="wifi" 
                checked={filters.amenities?.wifi}
                onCheckedChange={(checked) => handleAmenityChange('wifi', !!checked)}
              />
              <Label htmlFor="wifi">WiFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ac" 
                checked={filters.amenities?.ac}
                onCheckedChange={(checked) => handleAmenityChange('ac', !!checked)}
              />
              <Label htmlFor="ac">AC</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="kitchen" 
                checked={filters.amenities?.kitchen}
                onCheckedChange={(checked) => handleAmenityChange('kitchen', !!checked)}
              />
              <Label htmlFor="kitchen">Kitchen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="laundry" 
                checked={filters.amenities?.laundry}
                onCheckedChange={(checked) => handleAmenityChange('laundry', !!checked)}
              />
              <Label htmlFor="laundry">Laundry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="parking" 
                checked={filters.amenities?.parking}
                onCheckedChange={(checked) => handleAmenityChange('parking', !!checked)}
              />
              <Label htmlFor="parking">Parking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="furnished" 
                checked={filters.amenities?.furnished}
                onCheckedChange={(checked) => handleAmenityChange('furnished', !!checked)}
              />
              <Label htmlFor="furnished">Furnished</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
