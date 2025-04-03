import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

export function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { signIn, verifyOTP, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(phoneNumber);
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Please check your phone for the OTP',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send OTP',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP(phoneNumber, otp);
      toast({
        title: 'Success',
        description: 'Phone number verified successfully',
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to verify OTP',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Phone Authentication</CardTitle>
          <CardDescription>
            {isOtpSent
              ? 'Enter the OTP sent to your phone'
              : 'Enter your phone number to receive an OTP'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsOtpSent(false)}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 