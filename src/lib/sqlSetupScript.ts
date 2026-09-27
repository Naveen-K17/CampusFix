export const SUPABASE_SQL_SETUP = `-- ==============================================================================
-- CampusFix: Supabase Database Schema & Security Setup
-- University: Sapthagiri NPS University, Bengaluru
-- Initial Super Admin: naveenkattimani326@gmail.com
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    student_id TEXT, -- USN e.g. 1SG22CS001
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
    branch TEXT DEFAULT 'CSE',
    year TEXT DEFAULT '1st Year',
    semester TEXT DEFAULT 'Semester 1',
    cse_class TEXT NOT NULL, -- e.g. CSE-1 to CSE-50
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index on profiles email & role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Create COMPLAINTS table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number TEXT NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cse_class TEXT NOT NULL,
    building TEXT NOT NULL CHECK (building IN ('Block A', 'Block B', 'Block C')),
    room_number TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Fan', 'Electrical', 'Lighting', 'Projector', 'Furniture',
        'Wi-Fi / Internet', 'Plumbing', 'Cleanliness',
        'Laboratory Equipment', 'Door / Window', 'Other'
    )),
    description TEXT NOT NULL,
    image_url TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'In Progress', 'Resolved', 'Rejected')),
    admin_remark TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_student ON public.complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_building ON public.complaints(building);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON public.complaints(created_at DESC);

-- 4. Create COMPLAINT_UPDATES table (Timeline)
CREATE TABLE IF NOT EXISTS public.complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    remark TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_updates_complaint ON public.complaint_updates(complaint_id);

-- 5. Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- 6. Create ADMIN_REQUESTS table
CREATE TABLE IF NOT EXISTS public.admin_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    requested_email TEXT NOT NULL,
    requested_name TEXT NOT NULL,
    requested_role TEXT NOT NULL DEFAULT 'admin' CHECK (requested_role IN ('admin', 'super_admin')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'disabled')),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Trigger to automatically create profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role TEXT := 'student';
    target_class TEXT := 'CSE-1';
BEGIN
    -- Check if initial super admin
    IF NEW.email = 'naveenkattimani326@gmail.com' THEN
        assigned_role := 'super_admin';
    -- Check if approved admin request exists
    ELSIF EXISTS (SELECT 1 FROM public.admin_requests WHERE requested_email = NEW.email AND status = 'approved') THEN
        assigned_role := 'admin';
    END IF;

    -- Extract CSE class from raw_user_meta_data if present
    IF NEW.raw_user_meta_data->>'cse_class' IS NOT NULL THEN
        target_class := NEW.raw_user_meta_data->>'cse_class';
    END IF;

    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        student_id,
        role,
        branch,
        year,
        semester,
        cse_class
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'student_id',
        assigned_role,
        COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE'),
        COALESCE(NEW.raw_user_meta_data->>'year', '1st Year'),
        COALESCE(NEW.raw_user_meta_data->>'semester', 'Semester 1'),
        target_class
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RLS Policies: PROFILES
DROP POLICY IF EXISTS "Public can read student profile info" ON public.profiles;
CREATE POLICY "Users can read own profile or admins can read all"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Super admin can update roles in profiles"
ON public.profiles FOR UPDATE
USING (public.is_super_admin());

-- 10. RLS Policies: COMPLAINTS
CREATE POLICY "Students can create complaints"
ON public.complaints FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own complaints"
ON public.complaints FOR SELECT
USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Admins can update complaints"
ON public.complaints FOR UPDATE
USING (public.is_admin());

-- 11. RLS Policies: COMPLAINT_UPDATES
CREATE POLICY "Students can read updates for their own complaints"
ON public.complaint_updates FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.complaints c
        WHERE c.id = complaint_updates.complaint_id
        AND (c.student_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Admins can insert complaint updates"
ON public.complaint_updates FOR INSERT
WITH CHECK (public.is_admin());

-- 12. RLS Policies: NOTIFICATIONS
CREATE POLICY "Users can read their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification read status"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins or System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- 13. RLS Policies: ADMIN_REQUESTS
CREATE POLICY "Only super admin can view admin requests"
ON public.admin_requests FOR SELECT
USING (public.is_super_admin());

CREATE POLICY "Only super admin can insert or update admin requests"
ON public.admin_requests FOR ALL
USING (public.is_super_admin());

-- 14. Create Storage Bucket for Complaint Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS
CREATE POLICY "Allow public to view complaint images"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaint-images');

CREATE POLICY "Allow authenticated users to upload complaint images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'complaint-images'
    AND auth.role() = 'authenticated'
);

-- 15. Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaint_updates;
`;
