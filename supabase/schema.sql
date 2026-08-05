-- Aarya Raakh Recruitment Agency Database Schema for Supabase PostgreSQL

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    location VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    employment_type VARCHAR(100) NOT NULL DEFAULT 'Full-time', -- 'Full-time', 'Part-time', 'Contract', 'Remote'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for searching jobs by title, location, type, status
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- 2. APPLICATIONS TABLE (Job specific applications)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
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

-- Index for fast query by job_id or email
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);

-- 3. RESUME BANK TABLE (General candidate submissions)
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

-- Index for multi-attribute search in resume bank
CREATE INDEX IF NOT EXISTS idx_resume_bank_email ON public.resume_bank(email);
CREATE INDEX IF NOT EXISTS idx_resume_bank_preferred_role ON public.resume_bank(preferred_role);
CREATE INDEX IF NOT EXISTS idx_resume_bank_created_at ON public.resume_bank(created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_bank ENABLE ROW LEVEL SECURITY;

-- Jobs RLS: Everyone can view active jobs. Authenticated admins can perform all actions.
CREATE POLICY "Public can view active jobs" ON public.jobs
    FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated admins can manage jobs" ON public.jobs
    FOR ALL USING (auth.role() = 'authenticated');

-- Applications RLS: Anyone can submit an application. Only authenticated admins can view applications.
CREATE POLICY "Public can insert applications" ON public.applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated admins can view applications" ON public.applications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated admins can delete applications" ON public.applications
    FOR DELETE USING (auth.role() = 'authenticated');

-- Resume Bank RLS: Anyone can insert candidates. Only authenticated admins can view & delete candidates.
CREATE POLICY "Public can submit to resume bank" ON public.resume_bank
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated admins can view resume bank" ON public.resume_bank
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated admins can delete resume bank entries" ON public.resume_bank
    FOR DELETE USING (auth.role() = 'authenticated');

-- SUPABASE STORAGE BUCKET CONFIGURATION FOR RESUMES
-- Create public storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    true, 
    10485760, -- 10MB limit in bytes
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies: Anyone can upload a resume. Only authenticated users can delete or read raw files if restricted, or public read if public bucket.
CREATE POLICY "Anyone can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes');

-- SEED DEMO DATA
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
),
(
    'UI/UX Product Designer (iOS & Web)',
    'Join a fast-growing product design studio crafting iOS-first mobile designs, modern design systems, and web interfaces.',
    ARRAY['Create low and high fidelity wireframes and interactive prototypes in Figma', 'Develop design tokens and component libraries following iOS Human Interface Guidelines', 'Conduct usability testing sessions with real users', 'Work directly with frontend engineers for seamless implementation'],
    ARRAY['Figma', 'UI/UX Design', 'Design Systems', 'iOS Guidelines', 'Prototyping', 'User Research'],
    'Remote',
    '3+ Years',
    '₹12,00,000 - ₹16,00,000 P.A.',
    'Full-time',
    'active'
),
(
    'Cloud DevOps Engineer (AWS & Kubernetes)',
    'Manage infrastructure automation, CI/CD pipelines, and cloud security for high-traffic SaaS platforms.',
    ARRAY['Build and maintain Terraform IAC templates across multi-region AWS environments', 'Configure Kubernetes clusters (EKS) and monitor service metrics', 'Implement zero-downtime deployment pipelines with GitHub Actions', 'Enforce cloud security compliance and cost optimization'],
    ARRAY['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Python', 'Linux'],
    'Pune, Maharashtra (Hybrid)',
    '4+ Years',
    '₹14,00,000 - ₹19,00,000 P.A.',
    'Full-time',
    'active'
),
(
    'Financial Analyst & Risk Manager',
    'Provide quantitative financial modeling, corporate budgeting, and risk mitigation strategies for multinational clients.',
    ARRAY['Perform corporate valuation, forecasting, and scenario analysis', 'Prepare monthly executive dashboard reports', 'Evaluate investment risks and capital allocation efficiency', 'Coordinate with audit and compliance teams'],
    ARRAY['Financial Modeling', 'Corporate Finance', 'Excel/VBA', 'Risk Analysis', 'Power BI'],
    'Delhi NCR (On-site)',
    '3+ Years',
    '₹10,00,000 - ₹14,00,000 P.A.',
    'Full-time',
    'active'
),
(
    'Data Scientist (Machine Learning & NLP)',
    'Develop predictive analytics models and generative AI workflows to solve complex enterprise data problems.',
    ARRAY['Build LLM fine-tuning and retrieval-augmented generation (RAG) pipelines', 'Develop predictive classification and regression models in Python', 'Clean, engineer features, and validate massive datasets', 'Deploy ML models into production API endpoints'],
    ARRAY['Python', 'PyTorch', 'Machine Learning', 'NLP', 'SQL', 'Scikit-Learn', 'FastAPI'],
    'Hyderabad, Telangana (Remote)',
    '4+ Years',
    '₹16,00,000 - ₹22,00,000 P.A.',
    'Full-time',
    'active'
);
