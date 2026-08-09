import { Job, Application, ResumeBankEntry, JobFilters } from './types';
import { createClient } from './supabase/client';

export const DataService = {
  // JOBS
  async getJobs(): Promise<Job[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Job[];
  },

  async getActiveJobs(): Promise<Job[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Job[];
  },

  async getLatestOpenings(limit: number = 6): Promise<Job[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as Job[];
  },

  async getJobById(id: string): Promise<Job | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as Job | null;
  },

  async searchJobs(filters: JobFilters): Promise<Job[]> {
    const supabase = createClient();
    let query = supabase.from('jobs').select('*').eq('status', 'active');
    
    // We fetch active jobs and filter on the client since some filtering logic is complex.
    // In a real production app with millions of rows, we would use Supabase full-text search.
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    let activeJobs = data as Job[];

    return activeJobs.filter((job) => {
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchDesc = job.description.toLowerCase().includes(q);
        const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSkills) return false;
      }

      if (filters.location && filters.location !== 'all') {
        if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      if (filters.experience && filters.experience !== 'all') {
        if (!job.experience.toLowerCase().includes(filters.experience.toLowerCase())) {
          return false;
        }
      }

      if (filters.employmentType && filters.employmentType !== 'all') {
        if (job.employment_type !== filters.employmentType) {
          return false;
        }
      }

      return true;
    });
  },

  async addJob(jobData: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
    const supabase = createClient();
    const { data, error } = await supabase.from('jobs').insert([jobData]).select().single();
    if (error) throw error;
    return data as Job;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Job;
  },

  async deleteJob(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async toggleJobStatus(id: string): Promise<Job | null> {
    const job = await this.getJobById(id);
    if (!job) return null;
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    return this.updateJob(id, { status: newStatus });
  },

  // APPLICATIONS
  async hasCandidateApplied(jobId: string, email: string): Promise<boolean> {
    if (!jobId || !email) return false;
    const supabase = createClient();
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .ilike('email', email)
      .limit(1);
    if (error) throw error;
    return data && data.length > 0;
  },

  async submitApplication(appData: Omit<Application, 'id' | 'created_at'>): Promise<Application> {
    const alreadyApplied = await this.hasCandidateApplied(appData.job_id, appData.email);
    if (alreadyApplied) {
      throw new Error('You have already submitted an application for this job position.');
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('applications').insert([appData]).select().single();
    if (error) throw error;
    return data as Application;
  },

  async getApplications(): Promise<Application[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(title)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      job_title: item.jobs?.title || item.job_title || 'Unknown Position',
    }));
  },

  // RESUME BANK
  async submitToResumeBank(entryData: Omit<ResumeBankEntry, 'id' | 'created_at'>): Promise<ResumeBankEntry> {
    const supabase = createClient();
    const { data, error } = await supabase.from('resume_bank').insert([entryData]).select().single();
    if (error) throw error;
    return data as ResumeBankEntry;
  },

  async getResumeBank(): Promise<ResumeBankEntry[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_bank')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as ResumeBankEntry[];
  },

  // UPLOAD FILE TO STORAGE
  async uploadResume(file: File): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
    return data.publicUrl;
  },
};
