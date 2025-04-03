import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { Gender, Profession, LifestylePreferences } from '../../types/user';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile, isLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as Gender,
    profession: '' as Profession,
    contactDetails: {
      email: '',
      whatsapp: '',
    },
    lifestylePreferences: {
      smoking: false,
      pets: false,
      workFromHome: false,
      nightOwl: false,
      earlyBird: false,
      social: false,
      quiet: false,
    } as LifestylePreferences,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        age: parseInt(formData.age),
      });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      navigate('/listings');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleLifestyleChange = (key: keyof LifestylePreferences) => {
    setFormData(prev => ({
      ...prev,
      lifestylePreferences: {
        ...prev.lifestylePreferences,
        [key]: !prev.lifestylePreferences[key],
      },
    }));
  };

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us more about yourself to help find the perfect flatmate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: Gender) => setFormData(prev => ({ ...prev, gender: value }))}
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
                  value={formData.profession}
                  onValueChange={(value: Profession) => setFormData(prev => ({ ...prev, profession: value }))}
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
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactDetails.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactDetails: { ...prev.contactDetails, email: e.target.value },
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.contactDetails.whatsapp}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactDetails: { ...prev.contactDetails, whatsapp: e.target.value },
                  }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lifestyle Preferences</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking">Smoking</Label>
                  <Switch
                    id="smoking"
                    checked={formData.lifestylePreferences.smoking}
                    onCheckedChange={() => handleLifestyleChange('smoking')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pets">Pets</Label>
                  <Switch
                    id="pets"
                    checked={formData.lifestylePreferences.pets}
                    onCheckedChange={() => handleLifestyleChange('pets')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="workFromHome">Work from Home</Label>
                  <Switch
                    id="workFromHome"
                    checked={formData.lifestylePreferences.workFromHome}
                    onCheckedChange={() => handleLifestyleChange('workFromHome')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="nightOwl">Night Owl</Label>
                  <Switch
                    id="nightOwl"
                    checked={formData.lifestylePreferences.nightOwl}
                    onCheckedChange={() => handleLifestyleChange('nightOwl')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="earlyBird">Early Bird</Label>
                  <Switch
                    id="earlyBird"
                    checked={formData.lifestylePreferences.earlyBird}
                    onCheckedChange={() => handleLifestyleChange('earlyBird')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="social">Social</Label>
                  <Switch
                    id="social"
                    checked={formData.lifestylePreferences.social}
                    onCheckedChange={() => handleLifestyleChange('social')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiet">Quiet</Label>
                  <Switch
                    id="quiet"
                    checked={formData.lifestylePreferences.quiet}
                    onCheckedChange={() => handleLifestyleChange('quiet')}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 