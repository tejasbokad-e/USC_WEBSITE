-- Create ENUM types
CREATE TYPE public.user_role AS ENUM ('president', 'department_head', 'group_leader', 'member');
CREATE TYPE public.department_name AS ENUM ('academic_enhancement_board', 'sports_department', 'activity_department', 'hr_management');
CREATE TYPE public.group_name AS ENUM ('G1', 'G2', 'G3');

-- Create departments table
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name public.department_name UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name public.group_name UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  email text,
  role public.user_role DEFAULT 'member'::public.user_role NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  group_change_count int DEFAULT 0 NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scores table
CREATE TABLE public.scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  score numeric DEFAULT 0 NOT NULL,
  reason text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_materials table
CREATE TABLE public.study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  is_public boolean DEFAULT false NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create role_change_logs table
CREATE TABLE public.role_change_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  old_role public.user_role,
  new_role public.user_role NOT NULL,
  old_department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  new_department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  changed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_department ON public.profiles(department_id);
CREATE INDEX idx_profiles_group ON public.profiles(group_id);
CREATE INDEX idx_scores_user ON public.scores(user_id);
CREATE INDEX idx_scores_department ON public.scores(department_id);
CREATE INDEX idx_study_materials_department ON public.study_materials(department_id);
CREATE INDEX idx_study_materials_public ON public.study_materials(is_public);
CREATE INDEX idx_role_change_logs_user ON public.role_change_logs(user_id);

-- Insert initial departments
INSERT INTO public.departments (name, display_name, description) VALUES
  ('academic_enhancement_board', 'Academic Enhancement Board', 'Manages academic study materials and educational programs'),
  ('sports_department', 'Sports Department', 'Oversees sports activities and athletic programs'),
  ('activity_department', 'Activity Department', 'Coordinates organizational activities and events'),
  ('hr_management', 'HR Management', 'Handles human resources and member management');

-- Insert initial groups
INSERT INTO public.groups (name, display_name) VALUES
  ('G1', 'Group 1'),
  ('G2', 'Group 2'),
  ('G3', 'Group 3');

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('study_materials', 'study_materials', true);

-- Storage policies for study_materials bucket
CREATE POLICY "Public can view study materials" ON storage.objects
  FOR SELECT USING (bucket_id = 'study_materials');

CREATE POLICY "Authenticated users can upload study materials" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'study_materials');

CREATE POLICY "Uploaders can update their files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'study_materials' AND auth.uid() = owner);

CREATE POLICY "Uploaders can delete their files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'study_materials' AND auth.uid() = owner);