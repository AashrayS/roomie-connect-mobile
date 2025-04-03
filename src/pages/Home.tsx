import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { listingService } from "@/services/listingService";
import { Listing } from '@/types/listing';

export function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const data = await listingService.getListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        toast({
          title: "Error",
          description: "Failed to load listings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [toast]);

  if (loading) {
    return <div className="text-center">Loading listings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Available Flatshares</h1>
        {user ? (
          <Link to="/listings/new">
            <Button>Add New Listing</Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button>Login to Add Listing</Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <Card key={listing.id} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-600 mb-2">{listing.description}</p>
            <div className="flex justify-between items-center">
              <span>Rent: ₹{listing.rentAmount}</span>
              <Badge>{listing.genderPreference}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
