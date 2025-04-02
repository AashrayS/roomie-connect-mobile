
import { useState } from "react";
import { Bell, Bookmark, User, ChevronRight, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogin = () => {
    toast({
      title: "Login functionality",
      description: "This would normally open the login flow",
    });
    // This would normally be an API call
    setLoggedIn(true);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your account",
    });
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to Flatmate Finder</h1>
          <p className="text-muted-foreground">
            Sign in to create listings and connect with potential flatmates
          </p>
        </div>
        <Button size="lg" onClick={handleLogin} className="w-full mb-4">
          Sign in with Phone Number
        </Button>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    );
  }

  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      onClick: () => {
        toast({
          title: "Profile settings",
          description: "This would normally open profile settings",
        });
      },
    },
    {
      icon: Bookmark,
      label: "Saved Listings",
      onClick: () => {
        toast({
          title: "Saved listings",
          description: "This would show your saved listings",
        });
      },
    },
    {
      icon: Settings,
      label: "Account Settings",
      onClick: () => {
        toast({
          title: "Account settings",
          description: "This would normally open account settings",
        });
      },
    },
  ];

  return (
    <div className="pb-20">
      <div className="p-4 bg-primary/5">
        <div className="flex items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-xl font-bold">Abhishek Bhardwaj</h1>
            <p className="text-muted-foreground">+91 98765 43210</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => {
            toast({
              title: "Edit profile",
              description: "This would normally open profile edit",
            });
          }}
        >
          Edit Profile
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Bell size={20} className="mr-3 text-primary" />
              <span>Push Notifications</span>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            ACCOUNT SETTINGS
          </h2>
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center justify-between w-full py-2"
              onClick={item.onClick}
            >
              <div className="flex items-center">
                <item.icon size={20} className="mr-3 text-primary" />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/20 hover:bg-destructive/5"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" /> Log out
        </Button>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Flatmate Finder v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © 2023 Flatmate Finder. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
