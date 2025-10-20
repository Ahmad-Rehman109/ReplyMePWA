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

export async function signInWithOTP(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    }
  });
  
  if (error) {
    console.error('OTP send error:', error);
    throw error;
  }
}

export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });
  
  if (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
  
  return data;
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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
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
