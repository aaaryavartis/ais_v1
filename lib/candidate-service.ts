import { CandidateUser, Application } from './types';
import { createClient } from './supabase/client';

export const CandidateService = {
  async getCurrentCandidate(): Promise<CandidateUser | null> {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return null;

    return {
      ...profile,
      email: user.email,
    } as CandidateUser;
  },

  async isLoggedIn(): Promise<boolean> {
    const candidate = await this.getCurrentCandidate();
    return Boolean(candidate);
  },

  async loginCandidate(email: string, password?: string): Promise<CandidateUser> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'Candidate@123', // Default for demo if not provided
    });
    
    if (error) throw error;
    
    const candidate = await this.getCurrentCandidate();
    if (!candidate) throw new Error('Could not fetch candidate profile after login');
    return candidate;
  },

  async registerCandidate(data: Omit<CandidateUser, 'id' | 'created_at' | 'role' | 'status'>, password?: string): Promise<CandidateUser> {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: password || 'Candidate@123',
      options: {
        data: {
          name: data.name,
          role: 'candidate',
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Wait a brief moment for the trigger to insert the profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update the generated profile with the rest of the data
    const profileUpdates = {
      phone: data.phone,
      location: data.location,
      qualification: data.qualification,
      experience: data.experience,
      linkedin: data.linkedin,
      resume_url: data.resume_url,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', authData.user.id);

    if (updateError) throw updateError;

    const candidate = await this.getCurrentCandidate();
    if (!candidate) throw new Error('Could not fetch candidate profile after registration');
    return candidate;
  },

  async updateProfile(updates: Partial<CandidateUser>): Promise<CandidateUser | null> {
    const current = await this.getCurrentCandidate();
    if (!current) return null;

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', current.id);

    if (error) throw error;

    return this.getCurrentCandidate();
  },

  async logoutCandidate(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  async getMyAppliedJobs(): Promise<Application[]> {
    const current = await this.getCurrentCandidate();
    if (!current) return [];
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(title)')
      .eq('candidate_id', current.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      ...item,
      job_title: item.jobs?.title || item.job_title || 'Unknown Position',
    }));
  },

  // ── Password Reset ──────────────────────────────────────────────

  async generateResetToken(email: string): Promise<string | null> {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return "SENT"; // Supabase sends an email, we don't return a raw token
  },

  async resetPassword(password: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return true;
  }
};
