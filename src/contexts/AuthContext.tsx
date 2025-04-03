
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthState, UserProfile, Gender, Profession } from '../types/user';

interface AuthContextType extends AuthState {
  signIn: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
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
        // Add default values for required properties that might not exist in the database
        email: '',  // You might want to fetch this from auth.user.email
        gender: data.gender as Gender,
        profession: data.profession as Profession,
        contactVisibility: {
          showPhone: true,
          showEmail: true,
          showWhatsApp: true,
        },
        bio: '',
        preferences: {
          genderPreference: 'any',
        },
        notificationSettings: {
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

  const signIn = async (phoneNumber: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
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
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', state.user?.id);
      
      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...profile } : null,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const value = {
    ...state,
    signIn,
    verifyOTP,
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
