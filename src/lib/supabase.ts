import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface UserProfile {
  id: string; 
  email: string;
  name: string;
  age: number;
  address?: string;
  created_at: string;
  updated_at: string;
}

// Auth functions
export async function signInWithMagicLink(email: string) {
  // Multiple fallbacks
  const redirectTo = 
    import.meta.env.VITE_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'https://replyme-ecru.vercel.app';
  
  console.log('🔗 Redirect URL:', redirectTo);
  console.log('🌍 Environment:', import.meta.env.MODE);
  console.log('📦 VITE_APP_URL:', import.meta.env.VITE_APP_URL);
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    }
  });
  
  if (error) {
    console.error('Magic link error:', error);
    throw error;
  }
}
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Get user error:', error);
    return null;
  }
  return user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
    return null;
  }
  return session;
}

// Profile functions using KV store
export async function saveUserProfile(userId: string, profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  const userProfile: UserProfile = {
    id: userId,
    ...profile,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f94d273/profile`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, profile: userProfile })
  });

  if (!response.ok) {
    throw new Error('Failed to save profile');
  }
  
  return userProfile;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f94d273/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }

}


export async function signUpWithEmail(email: string, password: string) {
  // Get the correct redirect URL
  const redirectTo = 
    import.meta.env.VITE_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'https://replyme-ecru.vercel.app';
  
  console.log('🔗 Signup Redirect URL:', redirectTo);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      // This ensures the email is sent
      data: {
        email_confirm: true
      }
    }
  });
  
  if (error) {
    console.error('Signup error:', error);
    throw error;
  }
  
  // Log success for debugging
  console.log('✅ Signup successful:', {
    user: data.user?.email,
    needsConfirmation: !data.user?.email_confirmed_at
  });
  
  return data;
}

// Sign in with email and password
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }
  
  return data;
}

// Send password reset email
export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

// Update password (after reset link)
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    console.error('Update password error:', error);
    throw error;
  }
}
