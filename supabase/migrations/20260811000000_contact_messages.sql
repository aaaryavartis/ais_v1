-- Migration: Create Contact Messages Table

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster query
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages
CREATE POLICY "Public can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view the messages
CREATE POLICY "Authenticated admins can view contact messages" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can delete messages
CREATE POLICY "Authenticated admins can delete contact messages" ON public.contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');
