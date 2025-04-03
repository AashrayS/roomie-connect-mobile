import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { AlertTriangle, LogOut, Shield, Bell, Eye, EyeOff } from 'lucide-react';

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, logout, updatePassword, updateNotificationSettings } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.notificationSettings?.emailNotifications ?? true,
    pushNotifications: user?.notificationSettings?.pushNotifications ?? true,
    whatsappNotifications: user?.notificationSettings?.whatsappNotifications ?? true,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Show success toast
    } catch (error) {
      console.error('Error updating password:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateNotificationSettings(notificationSettings);
      // Show success toast
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={() => handleNotificationChange('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications on your device</p>
            </div>
            <Switch
              checked={notificationSettings.pushNotifications}
              onCheckedChange={() => handleNotificationChange('pushNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>WhatsApp Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via WhatsApp</p>
            </div>
            <Switch
              checked={notificationSettings.whatsappNotifications}
              onCheckedChange={() => handleNotificationChange('whatsappNotifications')}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleNotificationSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AlertTriangle className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Login History</h3>
              <p className="text-sm text-gray-500">View your recent login activity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 