import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { UserContactVisibility } from '../../types/listing';
import { Phone, Mail, MessageCircle, Eye, EyeOff } from 'lucide-react';

export function PersonalInfoPage() {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    contactVisibility: user?.contactVisibility || {
      showPhone: true,
      showEmail: true,
      showWhatsApp: true,
    } as UserContactVisibility,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (field: keyof UserContactVisibility) => {
    setFormData(prev => ({
      ...prev,
      contactVisibility: {
        ...prev.contactVisibility,
        [field]: !prev.contactVisibility[field],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        ...formData,
      });
      // Show success toast
    } catch (error) {
      console.error('Error updating contact information:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage how others can contact you</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type={showPhone ? 'text' : 'password'}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPhone(!showPhone)}
                >
                  {showPhone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type={showEmail ? 'text' : 'password'}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowEmail(!showEmail)}
                >
                  {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Contact Visibility</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label htmlFor="showPhone">Show Phone Number</Label>
                    <p className="text-sm text-gray-500">Allow others to see your phone number</p>
                  </div>
                </div>
                <Switch
                  id="showPhone"
                  checked={formData.contactVisibility.showPhone}
                  onCheckedChange={() => handleVisibilityChange('showPhone')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label htmlFor="showEmail">Show Email Address</Label>
                    <p className="text-sm text-gray-500">Allow others to see your email address</p>
                  </div>
                </div>
                <Switch
                  id="showEmail"
                  checked={formData.contactVisibility.showEmail}
                  onCheckedChange={() => handleVisibilityChange('showEmail')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label htmlFor="showWhatsApp">Show WhatsApp Contact</Label>
                    <p className="text-sm text-gray-500">Allow others to contact you via WhatsApp</p>
                  </div>
                </div>
                <Switch
                  id="showWhatsApp"
                  checked={formData.contactVisibility.showWhatsApp}
                  onCheckedChange={() => handleVisibilityChange('showWhatsApp')}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 