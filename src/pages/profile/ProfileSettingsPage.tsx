import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useListings } from '../../contexts/ListingContext';
import { Listing } from '../../types/listing';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { MapPin, Users, IndianRupee, Edit, Trash2, Heart, LogOut, Shield, Bell, Phone, Mail, Globe, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';

export function ProfileSettingsPage() {
  const { user, updateProfile, signOut } = useAuth();
  const { getUserListings } = useListings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    occupation: user?.occupation || '',
    bio: user?.bio || '',
    preferences: {
      smoking: user?.preferences?.smoking || false,
      pets: user?.preferences?.pets || false,
      drinking: user?.preferences?.drinking || false,
      foodHabits: user?.preferences?.foodHabits || 'vegetarian',
    },
    contactVisibility: {
      showPhone: user?.contactVisibility?.showPhone || false,
      showEmail: user?.contactVisibility?.showEmail || false,
      showWhatsApp: user?.contactVisibility?.showWhatsApp || true,
    },
  });

  useEffect(() => {
    const fetchSavedListings = async () => {
      try {
        // In a real app, you would fetch saved listings from the database
        // For now, we'll use the user's own listings as saved listings
        const listings = await getUserListings();
        setSavedListings(listings);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedListings();
  }, [getUserListings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (name: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleVisibilityChange = (name: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      contactVisibility: {
        ...prev.contactVisibility,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(profileData);
      // Show success toast
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error toast
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">
            <Edit className="h-4 w-4 mr-2" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="h-4 w-4 mr-2" />
            Saved Listings
          </TabsTrigger>
          <TabsTrigger value="account">
            <Shield className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) => handlePreferenceChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={profileData.occupation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foodHabits">Food Habits</Label>
                    <Select
                      value={profileData.preferences.foodHabits}
                      onValueChange={(value) => handlePreferenceChange('foodHabits', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select food habits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="h-24"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="smoking"
                        checked={profileData.preferences.smoking}
                        onChange={(e) => handlePreferenceChange('smoking', e.target.checked)}
                      />
                      <Label htmlFor="smoking">Smoking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="pets"
                        checked={profileData.preferences.pets}
                        onChange={(e) => handlePreferenceChange('pets', e.target.checked)}
                      />
                      <Label htmlFor="pets">Pets</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="drinking"
                        checked={profileData.preferences.drinking}
                        onChange={(e) => handlePreferenceChange('drinking', e.target.checked)}
                      />
                      <Label htmlFor="drinking">Drinking</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Contact Visibility
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Control what contact information is visible to other users when they view your listings
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="showPhone">Show Phone Number</Label>
                      </div>
                      <Switch
                        id="showPhone"
                        checked={profileData.contactVisibility.showPhone}
                        onCheckedChange={(checked) => handleVisibilityChange('showPhone', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="showEmail">Show Email</Label>
                      </div>
                      <Switch
                        id="showEmail"
                        checked={profileData.contactVisibility.showEmail}
                        onCheckedChange={(checked) => handleVisibilityChange('showEmail', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="showWhatsApp">Show WhatsApp</Label>
                      </div>
                      <Switch
                        id="showWhatsApp"
                        checked={profileData.contactVisibility.showWhatsApp}
                        onCheckedChange={(checked) => handleVisibilityChange('showWhatsApp', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Listings</CardTitle>
              <CardDescription>Your saved property listings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading saved listings...</div>
              ) : savedListings.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No saved listings yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedListings.map((listing) => (
                    <Card key={listing.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location.city}, {listing.location.state}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <IndianRupee className="h-5 w-5 mr-1" />
                            <span className="font-medium">{listing.rentAmount.toLocaleString()}</span>
                          </div>
                          <Badge variant={listing.isAvailable ? 'default' : 'secondary'}>
                            {listing.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {listing.numberOfFlatmates} flatmates
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/listings/${listing.id}`)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="emailNotifications" defaultChecked />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="pushNotifications" defaultChecked />
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Security</h3>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Two-Factor Authentication
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Danger Zone</h3>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 