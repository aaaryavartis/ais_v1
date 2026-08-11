export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
export type JobStatus = 'active' | 'inactive';
export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected';
export type UserRole = 'admin' | 'candidate';
export type UserStatus = 'active' | 'blocked';

export interface Job {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  location: string;
  experience: string;
  salary: string;
  employment_type: EmploymentType;
  status: JobStatus;
  created_at: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  job_id: string;
  job_title?: string;
  candidate_id?: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  location: string;
  linkedin?: string;
  resume_url: string;
  status?: ApplicationStatus;
  created_at: string;
}

export interface ResumeBankEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  location?: string;
  preferred_role: string;
  preferred_location: string;
  skills: string[];
  notes?: string;
  resume_url: string;
  created_at: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  location?: string;
  qualification?: string;
  experience?: string;
  preferred_role?: string;
  preferred_location?: string;
  skills?: string[];
  linkedin?: string;
  notes?: string;
  resume_url?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export type CandidateUser = UserAccount;

export interface JobFilters {
  query: string;
  location: string;
  experience: string;
  employmentType: string;
}

export interface ThemePalette {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  accentColor: string;
  isDarkDefault?: boolean;
  variables: {
    '--brand-50': string;
    '--brand-100': string;
    '--brand-200': string;
    '--brand-300': string;
    '--brand-400': string;
    '--brand-500': string;
    '--brand-600': string;
    '--brand-700': string;
    '--brand-800': string;
    '--brand-900': string;
    '--brand-950': string;
    '--accent-50': string;
    '--accent-500': string;
    '--accent-600': string;
  };
}
