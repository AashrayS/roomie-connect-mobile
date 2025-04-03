
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Share2, Phone, MessageSquare, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { listingService } from "@/services/ListingService";
import { useAuth } from "@/contexts/AuthContext";
import { Listing } from "@/types/listing";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingDialogOpen, setDeletingDialogOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        const data = await listingService.getListingById(id);
        setListing(data);
      } catch (error: any) {
        toast({
          title: "Error fetching listing",
          description: error.message || "Could not load listing details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Listing not found</h2>
        <p className="text-muted-foreground mb-4">
          The listing you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">Go back to home</Link>
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === listing.userId;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this flatshare: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      toast({
        title: "Link copied!",
        description: "Listing link copied to clipboard",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactToggle = () => {
    if (!showContact) {
      toast({
        title: "Contact details revealed",
        description: "You can now contact the lister directly.",
      });
    }
    setShowContact(!showContact);
  };

  const handleDelete = async () => {
    try {
      await listingService.deleteListing(listing!.id);
      toast({
        title: "Listing deleted",
        description: "The listing has been removed successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error deleting listing",
        description: error.message || "Could not delete listing",
        variant: "destructive",
      });
    }
  };

  const contactName = "Contact Owner"; // We would fetch this from profiles table
  const contactPhone = "+91 98765 43210"; // Mock data

  return (
    <div className="pb-20">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"
          alt={listing.title}
          className="w-full aspect-[3/2] object-cover"
        />
        <Link
          to="/"
          className="absolute top-4 left-4 bg-background/80 rounded-full p-2"
        >
          <ArrowLeft size={20} />
        </Link>
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-background/80 rounded-full p-2"
        >
          <Share2 size={20} />
        </button>
        {!listing.isAvailable && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              No Longer Available
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <div className="text-xl font-bold text-primary">₹{listing.rentAmount}/mo</div>
        </div>

        <div className="flex items-center mt-1 text-muted-foreground mb-3">
          <MapPin size={16} className="mr-1" />
          <span>
            {listing.location.address}, {listing.location.city}, {listing.location.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{listing.numberOfFlatmates} flatmates needed</Badge>
          <Badge
            className={
              listing.genderPreference === "male"
                ? "bg-secondary"
                : listing.genderPreference === "female"
                ? "bg-pink-500"
                : ""
            }
          >
            {listing.genderPreference === "male"
              ? "Male"
              : listing.genderPreference === "female"
              ? "Female"
              : "Any Gender"}
          </Badge>
          {listing.amenities && Object.entries(listing.amenities).filter(([_, value]) => value).map(([key], i) => (
            <Badge key={i} variant="secondary" className="bg-accent text-accent-foreground">
              {key}
            </Badge>
          ))}
        </div>

        <div className="mb-4 border-t border-border pt-3">
          <h2 className="font-semibold mb-2">About this place</h2>
          <p className="text-muted-foreground">{listing.description || "No description provided."}</p>
        </div>

        <div className="mb-4 border-t border-border pt-3">
          <h2 className="font-semibold mb-2">Rental Details</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Monthly Rent</p>
              <p className="font-medium">₹{listing.rentAmount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Security Deposit</p>
              <p className="font-medium">₹{listing.rentAmount * 2}</p>
            </div>
          </div>
        </div>

        {showContact && (
          <div className="mb-4 border-t border-border pt-3 animate-fade-in">
            <h2 className="font-semibold mb-2">Contact Information</h2>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-muted-foreground">Listed by</p>
                <p className="font-medium">{contactName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{contactPhone}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button className="w-full" asChild>
                  <a href={`tel:${contactPhone.replace(/\s+/g, '')}`}>
                    <Phone size={16} className="mr-2" /> Call
                  </a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href={`https://wa.me/${contactPhone.replace(/\s+/g, '')}`}>
                    <MessageSquare size={16} className="mr-2" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {isOwner && (
          <div className="mb-4 border-t border-border pt-3">
            <h2 className="font-semibold mb-2">Listing Management</h2>
            <div className="flex gap-2">
              <Button className="flex-1" asChild>
                <Link to={`/edit-listing/${listing.id}`}>
                  <Edit size={16} className="mr-2" /> Edit Listing
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setDeletingDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {!isOwner && (
        <div className="px-4 pb-4 sticky bottom-[76px] bg-background">
          <Button
            onClick={handleContactToggle}
            className="w-full"
            disabled={!listing.isAvailable}
          >
            {showContact ? "Hide Contact" : "Show Contact Information"}
          </Button>
        </div>
      )}

      <AlertDialog open={deletingDialogOpen} onOpenChange={setDeletingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListingDetail;
