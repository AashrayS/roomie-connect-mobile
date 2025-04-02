
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ListingProps {
  id: string;
  title: string;
  location: string;
  rent: number;
  roommates: number;
  gender: "male" | "female" | "any";
  amenities: string[];
  image: string;
  available: boolean;
}

const ListingCard = ({
  id,
  title,
  location,
  rent,
  roommates,
  gender,
  amenities,
  image,
  available,
}: ListingProps) => {
  return (
    <Link to={`/listing/${id}`} className="block">
      <div className="listing-card relative rounded-lg overflow-hidden border border-border bg-card">
        <div className="aspect-[4/3] relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {!available && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="absolute top-2 right-2">
                Filled
              </Badge>
            </div>
          )}
          <Badge
            className={`absolute top-2 ${available ? "right-2" : "left-2"} ${
              gender === "male" ? "bg-secondary" : gender === "female" ? "bg-pink-500" : ""
            }`}
          >
            {gender === "male" ? "Male" : gender === "female" ? "Female" : "Any Gender"}
          </Badge>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium line-clamp-1">{title}</h3>
            <span className="font-bold text-primary">₹{rent}/mo</span>
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline">{roommates} flatmates needed</Badge>
            {amenities.slice(0, 2).map((amenity, i) => (
              <Badge key={i} variant="secondary" className="bg-accent text-accent-foreground">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 2 && (
              <Badge variant="outline">+{amenities.length - 2} more</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
