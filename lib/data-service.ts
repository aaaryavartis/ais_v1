import { Job, Application, ResumeBankEntry, JobFilters } from './types';
import { INITIAL_JOBS, INITIAL_APPLICATIONS, INITIAL_RESUME_BANK } from './mock-data';
import { createClient } from './supabase/client';

const STORAGE_KEYS = {
  JOBS: 'aarya_raakh_jobs_v1',
  APPLICATIONS: 'aarya_raakh_applications_v1',
  RESUME_BANK: 'aarya_raakh_resume_bank_v1',
};

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('demo-aaryaraakh'));
}

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

export const DataService = {
  // JOBS
  async getJobs(): Promise<Job[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as Job[];
      } catch (e) {
        console.warn('Supabase fetch failed, using fallback mode:', e);
      }
    }
    return getLocal<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },

  async getActiveJobs(): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter((j) => j.status === 'active');
  },

  async getLatestOpenings(limit: number = 6): Promise<Job[]> {
    const activeJobs = await this.getActiveJobs();
    return activeJobs.slice(0, limit);
  },

  async getJobById(id: string): Promise<Job | null> {
    const jobs = await this.getJobs();
    return jobs.find((j) => j.id === id) || null;
  },

  async searchJobs(filters: JobFilters): Promise<Job[]> {
    const activeJobs = await this.getActiveJobs();
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
    const newJob: Job = {
      ...jobData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'job-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('jobs').insert([newJob]).select().single();
        if (!error && data) return data as Job;
      } catch (e) {
        console.error('Supabase addJob error:', e);
      }
    }

    const currentJobs = getLocal<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const updated = [newJob, ...currentJobs];
    setLocal(STORAGE_KEYS.JOBS, updated);
    return newJob;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('jobs')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Job;
      } catch (e) {
        console.error('Supabase updateJob error:', e);
      }
    }

    const jobs = getLocal<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;

    jobs[idx] = { ...jobs[idx], ...updates, updated_at: new Date().toISOString() };
    setLocal(STORAGE_KEYS.JOBS, jobs);
    return jobs[idx];
  },

  async deleteJob(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase deleteJob error:', e);
      }
    }

    const jobs = getLocal<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const filtered = jobs.filter((j) => j.id !== id);
    setLocal(STORAGE_KEYS.JOBS, filtered);
    return true;
  },

  async toggleJobStatus(id: string): Promise<Job | null> {
    const job = await this.getJobById(id);
    if (!job) return null;
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    return this.updateJob(id, { status: newStatus });
  },

  // APPLICATIONS WITH DUPLICATE PREVENTION
  async hasCandidateApplied(jobId: string, email: string): Promise<boolean> {
    if (!jobId || !email) return false;
    const apps = await this.getApplications();
    return apps.some(
      (a) => a.job_id === jobId && a.email.toLowerCase() === email.toLowerCase()
    );
  },

  async submitApplication(appData: Omit<Application, 'id' | 'created_at'>): Promise<Application> {
    // Check for duplicate application
    const alreadyApplied = await this.hasCandidateApplied(appData.job_id, appData.email);
    if (alreadyApplied) {
      throw new Error('You have already submitted an application for this job position.');
    }

    const newApp: Application = {
      ...appData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'app-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
        if (!error && data) return data as Application;
      } catch (e) {
        console.error('Supabase submitApplication error:', e);
      }
    }

    const apps = getLocal<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updated = [newApp, ...apps];
    setLocal(STORAGE_KEYS.APPLICATIONS, updated);
    return newApp;
  },

  async getApplications(): Promise<Application[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('applications')
          .select('*, jobs(title)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            job_title: item.jobs?.title || item.job_title || 'Unknown Position',
          }));
        }
      } catch (e) {
        console.warn('Supabase applications fetch error:', e);
      }
    }
    return getLocal<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  // RESUME BANK
  async submitToResumeBank(entryData: Omit<ResumeBankEntry, 'id' | 'created_at'>): Promise<ResumeBankEntry> {
    const newEntry: ResumeBankEntry = {
      ...entryData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'rb-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('resume_bank').insert([newEntry]).select().single();
        if (!error && data) return data as ResumeBankEntry;
      } catch (e) {
        console.error('Supabase submitToResumeBank error:', e);
      }
    }

    const entries = getLocal<ResumeBankEntry[]>(STORAGE_KEYS.RESUME_BANK, INITIAL_RESUME_BANK);
    const updated = [newEntry, ...entries];
    setLocal(STORAGE_KEYS.RESUME_BANK, updated);
    return newEntry;
  },

  async getResumeBank(): Promise<ResumeBankEntry[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('resume_bank')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as ResumeBankEntry[];
      } catch (e) {
        console.warn('Supabase resume bank fetch error:', e);
      }
    }
    return getLocal<ResumeBankEntry[]>(STORAGE_KEYS.RESUME_BANK, INITIAL_RESUME_BANK);
  },

  // UPLOAD FILE TO STORAGE
  async uploadResume(file: File): Promise<string> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (e) {
        console.error('Supabase storage upload error:', e);
      }
    }

    return URL.createObjectURL(file);
  },
};
