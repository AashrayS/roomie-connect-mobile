import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Gender } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'other' as Gender,
    profession: '',
    bio: '',
    contactVisibility: {
      showPhone: true,
      showEmail: true,
      showWhatsApp: true,
    },
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      whatsappNotifications: true,
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: (user.gender || 'other') as Gender,
        profession: user.profession || '',
        bio: user.bio || '',
        contactVisibility: user.contactVisibility || {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true,
        },
        notificationSettings: user.notificationSettings || {
          emailNotifications: true,
          pushNotifications: true,
          whatsappNotifications: true,
        }
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value as Gender }));
  };

  const handleProfessionChange = (value: string) => {
    setFormData(prev => ({ ...prev, profession: value }));
  };

  const handleVisibilityChange = (key: keyof typeof formData.contactVisibility, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      contactVisibility: {
        ...prev.contactVisibility,
        [key]: value
      }
    }));
  };

  const handleNotificationChange = (key: keyof typeof formData.notificationSettings, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as Gender,
        profession: formData.profession,
        bio: formData.bio,
        contactVisibility: formData.contactVisibility,
        notificationSettings: formData.notificationSettings
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="preferences">Preferences & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and how others see you on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Phone number cannot be changed as it's used for authentication
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={handleGenderChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select
                    value={formData.profession}
                    onValueChange={handleProfessionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="working_professional">Working Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others a bit about yourself"
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Visibility</CardTitle>
              <CardDescription>
                Control which contact information is visible to other users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Phone Number</p>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your phone number
                  </p>
                </div>
                <Switch
                  checked={formData.contactVisibility.showPhone}
                  onCheckedChange={(checked) => handleVisibilityChange('showPhone', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Email</p>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your email address
                  </p>
                </div>
                <Switch
                  checked={formData.contactVisibility.showEmail}
                  onCheckedChange={(checked) => handleVisibilityChange('showEmail', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">WhatsApp Contact</p>
                  <p className="text-sm text-muted-foreground">
                    Allow others to contact you via WhatsApp
                  </p>
                </div>
                <Switch
                  checked={formData.contactVisibility.showWhatsApp}
                  onCheckedChange={(checked) => handleVisibilityChange('showWhatsApp', checked)}
                />
              </div>
              
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={formData.notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch
                  checked={formData.notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">WhatsApp Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via WhatsApp
                  </p>
                </div>
                <Switch
                  checked={formData.notificationSettings.whatsappNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('whatsappNotifications', checked)}
                />
              </div>
              
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
