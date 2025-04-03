import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

export function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been signed out",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          {user ? (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <Button onClick={handleSignOut} className="mt-4">
                Sign Out
              </Button>
            </>
          ) : (
            <p>No user information available.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
