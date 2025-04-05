
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, Gender, Profession, AuthState } from '../types/user';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
  updateNotificationSettings?: (settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    whatsappNotifications: boolean;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Map database fields to UserProfile type
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name || '',
        phone: data.phone_number || '',
        phone_number: data.phone_number,
        email: '', // You might want to fetch this from auth.user.email
        gender: data.gender as Gender,
        profession: data.profession as Profession,
        bio: data.bio || '',
        contactVisibility: {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true,
        },
        preferences: {
          genderPreference: 'any',
          lifestyle: {
            smoking: false,
            pets: false,
            workFromHome: false,
            nightOwl: false,
            earlyBird: false,
            social: false,
            quiet: false,
          }
        },
        notificationSettings: {
          newMessages: true,
          newMatches: true,
          marketing: true,
          emailNotifications: true,
          pushNotifications: true,
          whatsappNotifications: true,
        },
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setState({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Convert from UserProfile format to database format
      const dbProfile: any = {};
      
      if (profile.name !== undefined) dbProfile.name = profile.name;
      if (profile.phone_number !== undefined) dbProfile.phone_number = profile.phone_number;
      if (profile.gender !== undefined) dbProfile.gender = profile.gender;
      if (profile.profession !== undefined) dbProfile.profession = profile.profession;
      if (profile.bio !== undefined) dbProfile.bio = profile.bio;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', state.user?.id);
      
      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...profile } : null,
        isLoading: false,
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));

      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: "destructive",
      });
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
