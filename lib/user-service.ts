import { UserAccount, UserRole, UserStatus } from './types';
import { createClient } from './supabase/client';
import { DataService } from './data-service';

export const UserService = {
  async getAllUsers(): Promise<UserAccount[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as UserAccount[];
  },

  async getCurrentUser(): Promise<UserAccount | null> {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return null;
    return { ...profile, email: user.email } as UserAccount;
  },

  async login(email: string, password?: string): Promise<UserAccount> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'Admin@12345',
    });
    
    if (error) throw error;

    const profile = await this.getCurrentUser();
    if (!profile) throw new Error('Could not fetch user profile after login');
    
    if (profile.status === 'blocked') {
      await supabase.auth.signOut();
      throw new Error('Your account has been suspended by the administrator.');
    }

    return profile;
  },

  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  },

  async toggleUserStatus(userId: string): Promise<UserStatus> {
    const supabase = createClient();
    
    // Fetch current status
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', userId)
      .single();
      
    if (fetchError || !profile) throw fetchError || new Error('User not found');
    
    const newStatus = profile.status === 'active' ? 'blocked' : 'active';
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    return newStatus;
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
  },
};
