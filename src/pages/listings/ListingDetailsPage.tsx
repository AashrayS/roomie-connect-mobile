import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../../contexts/ListingContext';
import { useWhatsApp } from '../../contexts/WhatsAppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Listing } from '../../types/listing';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { MapPin, Users, IndianRupee, ArrowLeft, Edit, Trash2, MessageCircle, Flag, Phone, Mail, Globe, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListingById, deleteListing, toggleAvailability } = useListings();
  const { sendMessage } = useWhatsApp();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, getListingById]);

  const handleDelete = async () => {
    if (!listing || !window.confirm('Are you sure you want to delete this listing?')) return;

    setIsDeleting(true);
    try {
      await deleteListing(listing.id);
      navigate('/listings');
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!listing) return;

    setIsToggling(true);
    try {
      await toggleAvailability(listing.id, !listing.isAvailable);
      setListing(prev => prev ? { ...prev, isAvailable: !prev.isAvailable } : null);
    } catch (error) {
      console.error('Error toggling availability:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleReport = () => {
    // In a real app, we would implement the report functionality
    console.log('Report listing:', listing?.id);
  };

  const handleContact = async () => {
    if (!listing || !user) return;

    setIsSendingMessage(true);
    try {
      // Format the phone number to remove any non-numeric characters
      const phoneNumber = listing.userPhone?.replace(/\D/g, '') || '';
      
      if (!phoneNumber) {
        throw new Error('Phone number not available');
      }

      // Create the message
      const message = `Hi! I'm interested in your listing "${listing.title}". I found it on Flatmate Finder. Can we discuss the details?`;
      
      // Create the WhatsApp URL with the phone number and message
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Log the message in our database
      await sendMessage({
        to: phoneNumber,
        message,
        listingId: listing.id,
        listingTitle: listing.title,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error toast or alert
      alert('Unable to open WhatsApp. Please make sure the phone number is available.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading) {
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
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === listing.userId;

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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location.address}, {listing.location.city}, {listing.location.state}
              </CardDescription>
            </div>
            <Badge variant={listing.isAvailable ? 'default' : 'secondary'}>
              {listing.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Listing Details</TabsTrigger>
              {!isOwner && <TabsTrigger value="contact">Contact Info</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-lg font-medium">{listing.rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-lg">{listing.numberOfFlatmates} flatmates</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg">Gender Preference: {listing.genderPreference}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(listing.amenities)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <Badge key={key} variant="outline" className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            </TabsContent>

            {!isOwner && (
              <TabsContent value="contact">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Listed by</h3>
                      <p className="text-gray-600">{listing.userName || 'Anonymous User'}</p>
                    </div>
                  </div>

                  {listing.userContactVisibility?.showPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600">{listing.userPhone || 'Not available'}</p>
                      </div>
                    </div>
                  )}

                  {listing.userContactVisibility?.showEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">{listing.userEmail || 'Not available'}</p>
                      </div>
                    </div>
                  )}

                  {listing.userContactVisibility?.showWhatsApp && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">WhatsApp</h3>
                        <p className="text-gray-600">Available for messaging</p>
                      </div>
                    </div>
                  )}

                  {listing.userContactVisibility?.showWhatsApp && (
                    <div className="pt-4">
                      <Button 
                        onClick={handleContact} 
                        disabled={isSendingMessage}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {isSendingMessage ? 'Opening WhatsApp...' : 'Contact on WhatsApp'}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            {isOwner ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/listings/${listing.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleAvailability}
                  disabled={isToggling}
                >
                  {isToggling ? 'Updating...' : listing.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleReport}>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            )}
          </div>
          <span className="text-sm text-gray-500">
            Posted on {new Date(listing.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
} 