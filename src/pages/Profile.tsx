import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Bookmark, User, ChevronRight, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/supabase";

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        } catch (error: any) {
          toast({
            title: "Error fetching profile",
            description: error.message || "An error occurred while fetching your profile",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4 bg-primary/5">
        <div className="flex items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} />
            <AvatarFallback>{profile?.name?.substring(0, 2) || user?.email?.substring(0, 2) || "??"}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-xl font-bold">{profile?.name || user?.email?.split('@')[0] || "User"}</h1>
            <p className="text-muted-foreground">{profile?.phone_number || user?.email || ""}</p>
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
