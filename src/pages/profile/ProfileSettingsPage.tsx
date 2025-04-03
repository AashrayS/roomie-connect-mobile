import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '../../hooks/use-toast';
import { Gender, Profession } from '../../types/user';

export function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    profession: user?.profession || '',
    genderPreference: user?.preferences?.genderPreference || 'any',
    bio: user?.bio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: formData.name,
        gender: formData.gender as Gender,
        profession: formData.profession as Profession,
        preferences: {
          genderPreference: formData.genderPreference,
        },
        bio: formData.bio,
      });
      toast({
        title: "Success",
        description: "Profile settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile settings:', error);
      toast({
        title: "Error",
        description: "Failed to update profile settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange('gender', value)}
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
              onValueChange={(value) => handleSelectChange('profession', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genderPreference">Preferred Gender for Flatmates</Label>
            <Select
              value={formData.genderPreference}
              onValueChange={(value) => handleSelectChange('genderPreference', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write a short bio about yourself"
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
