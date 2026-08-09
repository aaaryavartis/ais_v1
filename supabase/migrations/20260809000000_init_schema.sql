-- Aarya Raakh Recruitment Agency Database Schema for Supabase PostgreSQL

-- Enable UUID Extension and pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'candidate', -- 'admin' or 'candidate'
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    phone VARCHAR(50),
    location VARCHAR(255),
    qualification VARCHAR(255),
    experience VARCHAR(100),
    preferred_role VARCHAR(255),
    preferred_location VARCHAR(255),
    skills TEXT[] DEFAULT '{}',
    linkedin VARCHAR(500),
    notes TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'candidate')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    location VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    employment_type VARCHAR(100) NOT NULL DEFAULT 'Full-time',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- 3. APPLICATIONS TABLE (Job specific applications)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    linkedin VARCHAR(500),
    resume_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);

-- 4. RESUME BANK TABLE (General candidate submissions)
CREATE TABLE IF NOT EXISTS public.resume_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    preferred_role VARCHAR(255) NOT NULL,
    preferred_location VARCHAR(255) NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT,
    resume_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resume_bank_email ON public.resume_bank(email);
CREATE INDEX IF NOT EXISTS idx_resume_bank_preferred_role ON public.resume_bank(preferred_role);
CREATE INDEX IF NOT EXISTS idx_resume_bank_created_at ON public.resume_bank(created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_bank ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER FUNCTION TO AVOID INFINITE RECURSION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles RLS
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  public.is_admin()
);

-- Jobs RLS
CREATE POLICY "Public can view active jobs" ON public.jobs FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated admins can manage jobs" ON public.jobs FOR ALL USING (
  public.is_admin()
);

-- Applications RLS
CREATE POLICY "Public can insert applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Authenticated admins can view applications" ON public.applications FOR SELECT USING (
  public.is_admin()
);
CREATE POLICY "Authenticated admins can delete applications" ON public.applications FOR DELETE USING (
  public.is_admin()
);

-- Resume Bank RLS
CREATE POLICY "Public can submit to resume bank" ON public.resume_bank FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated admins can view resume bank" ON public.resume_bank FOR SELECT USING (
  public.is_admin()
);
CREATE POLICY "Authenticated admins can delete resume bank entries" ON public.resume_bank FOR DELETE USING (
  public.is_admin()
);

-- SUPABASE STORAGE BUCKET CONFIGURATION FOR RESUMES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    true, 
    10485760,
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Anyone can view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- SEED DATA
-- 1. Create Admin User
DO $$
DECLARE
  admin_uid UUID := '00000000-0000-0000-0000-000000000000';
  user_uid UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Insert into auth.users if not exists (Admin account)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@aaryaraakh.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      admin_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@aaryaraakh.com', crypt('0999#jay', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Admin", "role": "admin"}', now(), now(), '', '', '', ''
    );
  END IF;

  -- Insert into auth.users if not exists (Requested user account)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jaygangurde8@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      user_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jaygangurde8@gmail.com', crypt('Candidate@123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Jay Gangurde", "role": "candidate"}', now(), now(), '', '', '', ''
    );
  END IF;
END $$;

-- Jobs
INSERT INTO public.jobs (title, description, responsibilities, skills, location, experience, salary, employment_type, status)
VALUES 
(
    'Senior Full Stack Developer (Next.js & Node.js)',
    'We are seeking an experienced Senior Full Stack Developer to lead the architecture and deployment of enterprise web applications for our global clients.',
    ARRAY['Design scalable frontend architectures using Next.js and TypeScript', 'Build high-performance microservices and RESTful API endpoints', 'Optimize SQL database performance and manage cloud integrations', 'Collaborate closely with UI/UX designers and product managers'],
    ARRAY['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    'Mumbai, Maharashtra (Hybrid)',
    '5+ Years',
    '₹18,000,00 - ₹24,00,000 P.A.',
    'Full-time',
    'active'
),
(
    'Lead Talent Acquisition Manager',
    'Drive end-to-end recruitment strategies for senior executive positions across IT, Finance, and Consulting verticals.',
    ARRAY['Manage full lifecycle hiring for executive and niche technical roles', 'Build talent pipelines and conduct structured interviews', 'Partner with enterprise business stakeholders to clarify workforce planning', 'Mentor junior recruiters and optimize ATS workflows'],
    ARRAY['Talent Acquisition', 'Executive Search', 'Technical Recruitment', 'HR Strategy', 'ATS'],
    'Bengaluru, Karnataka (On-site)',
    '6+ Years',
    '₹15,000,00 - ₹20,00,000 P.A.',
    'Full-time',
    'active'
);
