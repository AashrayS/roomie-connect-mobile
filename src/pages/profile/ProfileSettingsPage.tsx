import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';
import { Gender, Profession, UserProfile } from '../../types/user';

export function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    profession: '',
    bio: '',
    preferences: {
      genderPreference: 'any',
      maxRent: undefined,
      preferredLocations: [],
      smoking: false,
      pets: false,
    },
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        profession: user?.profession || '',
        bio: user?.bio || '',
        preferences: {
          genderPreference: user?.preferences?.genderPreference || 'any',
          maxRent: user?.preferences?.maxRent,
          preferredLocations: user?.preferences?.preferredLocations,
          smoking: user?.preferences?.smoking || false,
          pets: user?.preferences?.pets || false,
        },
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender as Gender,
        profession: userData.profession as Profession,
        bio: userData.bio,
        preferences: {
          genderPreference: userData.preferences.genderPreference,
          maxRent: userData.preferences.maxRent,
          preferredLocations: userData.preferences.preferredLocations,
          smoking: userData.preferences.smoking,
          pets: userData.preferences.pets,
        },
        contactVisibility: {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true,
        },
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={userData.gender}
                  onValueChange={(value: Gender) => setUserData(prev => ({ ...prev, gender: value }))}
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
                <Label htmlFor="profession">Profession</Label>
                <Select
                  value={userData.profession}
                  onValueChange={(value: Profession) => setUserData(prev => ({ ...prev, profession: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="working_professional">Working Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferences</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking">Smoking</Label>
                  <Switch
                    id="smoking"
                    name="smoking"
                    checked={userData.preferences.smoking || false}
                    onCheckedChange={(checked) => setUserData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        smoking: checked,
                      },
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pets">Pets</Label>
                  <Switch
                    id="pets"
                    name="pets"
                    checked={userData.preferences.pets || false}
                    onCheckedChange={(checked) => setUserData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        pets: checked,
                      },
                    }))}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
