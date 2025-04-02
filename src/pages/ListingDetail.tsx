
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Share2, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Modern PG in Koramangala",
    location: "Koramangala 5th Block, Bengaluru",
    rent: 12000,
    roommates: 2,
    gender: "male" as const,
    amenities: ["WiFi", "AC", "Furnished"],
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    available: true,
    depositAmount: 20000,
    contactName: "Rahul Sharma",
    contactPhone: "+91 9876543210",
    description:
      "Spacious 3BHK apartment with modern amenities. Looking for 2 working professionals or students. The flat has 24/7 water supply, power backup and security.",
  },
  {
    id: "2",
    title: "Spacious Flat in HSR Layout",
    location: "HSR Layout Sector 2, Bengaluru",
    rent: 15000,
    roommates: 1,
    gender: "any" as const,
    amenities: ["WiFi", "Geyser", "Parking", "Gym"],
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    available: true,
    depositAmount: 30000,
    contactName: "Priya Patel",
    contactPhone: "+91 8765432109",
    description:
      "Beautiful flat in a premium society with swimming pool and gym. Looking for one flatmate to share. No restrictions on food preferences. Pets are allowed.",
  },
  {
    id: "3",
    title: "Budget-friendly PG near Indiranagar",
    location: "Indiranagar 100ft Road, Bengaluru",
    rent: 8000,
    roommates: 3,
    gender: "female" as const,
    amenities: ["Furnished", "WiFi", "AC", "Food"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    available: false,
    depositAmount: 15000,
    contactName: "Sneha Gupta",
    contactPhone: "+91 7654321098",
    description:
      "Women's PG with food included (3 meals a day). Walking distance from Indiranagar metro station. Currently filled but may have vacancies next month.",
  },
];

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showContact, setShowContact] = useState(false);

  const listing = MOCK_LISTINGS.find((item) => item.id === id);

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

  return (
    <div className="pb-20">
      <div className="relative">
        <img
          src={listing.image}
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
        {!listing.available && (
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
          <div className="text-xl font-bold text-primary">₹{listing.rent}/mo</div>
        </div>

        <div className="flex items-center mt-1 text-muted-foreground mb-3">
          <MapPin size={16} className="mr-1" />
          <span>{listing.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{listing.roommates} flatmates needed</Badge>
          <Badge
            className={
              listing.gender === "male"
                ? "bg-secondary"
                : listing.gender === "female"
                ? "bg-pink-500"
                : ""
            }
          >
            {listing.gender === "male"
              ? "Male"
              : listing.gender === "female"
              ? "Female"
              : "Any Gender"}
          </Badge>
          {listing.amenities.map((amenity, i) => (
            <Badge key={i} variant="secondary" className="bg-accent text-accent-foreground">
              {amenity}
            </Badge>
          ))}
        </div>

        <div className="mb-4 border-t border-border pt-3">
          <h2 className="font-semibold mb-2">About this place</h2>
          <p className="text-muted-foreground">{listing.description}</p>
        </div>

        <div className="mb-4 border-t border-border pt-3">
          <h2 className="font-semibold mb-2">Rental Details</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Monthly Rent</p>
              <p className="font-medium">₹{listing.rent}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Security Deposit</p>
              <p className="font-medium">₹{listing.depositAmount}</p>
            </div>
          </div>
        </div>

        {showContact && (
          <div className="mb-4 border-t border-border pt-3 animate-fade-in">
            <h2 className="font-semibold mb-2">Contact Information</h2>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-muted-foreground">Listed by</p>
                <p className="font-medium">{listing.contactName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{listing.contactPhone}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button className="w-full" asChild>
                  <a href={`tel:${listing.contactPhone}`}>
                    <Phone size={16} className="mr-2" /> Call
                  </a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href={`https://wa.me/${listing.contactPhone.replace(/\s+/g, '')}`}>
                    <MessageSquare size={16} className="mr-2" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 sticky bottom-[76px] bg-background">
        <Button
          onClick={handleContactToggle}
          className="w-full"
          disabled={!listing.available}
        >
          {showContact ? "Hide Contact" : "Show Contact Information"}
        </Button>
      </div>
    </div>
  );
};

export default ListingDetail;
