
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useListings } from '@/contexts/ListingContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Profession, Gender } from '@/types/user';

export function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const { listings } = useListings();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    profession: '',
    bio: '',
    preferences: {
      smoking: false,
      pets: false,
      drinking: false,
      foodHabits: '',
      genderPreference: 'any' as 'male' | 'female' | 'any',
      maxRent: 0,
      preferredLocations: [] as string[]
    },
    contactVisibility: {
      showPhone: true,
      showEmail: true,
      showWhatsApp: true
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        profession: user.profession || '',
        bio: user.bio || '',
        preferences: {
          genderPreference: user.preferences?.genderPreference || 'any',
          maxRent: user.preferences?.maxRent || 0,
          preferredLocations: user.preferences?.preferredLocations || [],
          smoking: false,
          pets: false,
          drinking: false,
          foodHabits: ''
        },
        contactVisibility: {
          showPhone: user.contactVisibility?.showPhone ?? true,
          showEmail: user.contactVisibility?.showEmail ?? true,
          showWhatsApp: user.contactVisibility?.showWhatsApp ?? true
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender as Gender,
        profession: formData.profession as Profession,
        bio: formData.bio,
        preferences: {
          genderPreference: formData.preferences.genderPreference,
          maxRent: formData.preferences.maxRent,
          preferredLocations: formData.preferences.preferredLocations
        },
        contactVisibility: formData.contactVisibility
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Please log in to view your profile settings.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select 
                    value={formData.profession}
                    onValueChange={(value) => setFormData({...formData, profession: value})}
                  >
                    <SelectTrigger id="profession">
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="working_professional">Working Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell potential flatmates about yourself..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="genderPreference">Gender Preference for Flatmates</Label>
                <Select 
                  value={formData.preferences.genderPreference}
                  onValueChange={(value: 'male' | 'female' | 'any') => 
                    setFormData({
                      ...formData, 
                      preferences: {...formData.preferences, genderPreference: value}
                    })
                  }
                >
                  <SelectTrigger id="genderPreference">
                    <SelectValue placeholder="Select gender preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">No Preference</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxRent">Maximum Budget (₹)</Label>
                <Input 
                  id="maxRent"
                  type="number"
                  value={formData.preferences.maxRent || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    preferences: {
                      ...formData.preferences, 
                      maxRent: parseInt(e.target.value) || 0
                    }
                  })}
                  placeholder="Your max budget"
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Contact Visibility</h3>
              <p className="text-sm text-gray-500">Control who can see your contact information</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showPhone" className="cursor-pointer">Show Phone Number</Label>
                  <Switch 
                    id="showPhone"
                    checked={formData.contactVisibility.showPhone}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      contactVisibility: {...formData.contactVisibility, showPhone: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showEmail" className="cursor-pointer">Show Email Address</Label>
                  <Switch 
                    id="showEmail"
                    checked={formData.contactVisibility.showEmail}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      contactVisibility: {...formData.contactVisibility, showEmail: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWhatsApp" className="cursor-pointer">Available on WhatsApp</Label>
                  <Switch 
                    id="showWhatsApp"
                    checked={formData.contactVisibility.showWhatsApp}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      contactVisibility: {...formData.contactVisibility, showWhatsApp: checked}
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/profile')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
