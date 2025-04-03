
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ListingFilters } from '@/types/listing';

interface SearchFiltersProps {
  onSearch: (filters: ListingFilters) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<ListingFilters>({});

  const handleChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const resetFilters = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={filters.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genderPreference">Gender Preference</Label>
              <Select
                value={filters.genderPreference || ''}
                onValueChange={(value) => handleChange('genderPreference', value)}
              >
                <SelectTrigger id="genderPreference">
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
              <Label htmlFor="minRent">Min Rent (₹)</Label>
              <Input
                id="minRent"
                type="number"
                placeholder="Min rent"
                value={filters.minRent || ''}
                onChange={(e) => handleChange('minRent', parseInt(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxRent">Max Rent (₹)</Label>
              <Input
                id="maxRent"
                type="number"
                placeholder="Max rent"
                value={filters.maxRent || ''}
                onChange={(e) => handleChange('maxRent', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button type="submit">
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
