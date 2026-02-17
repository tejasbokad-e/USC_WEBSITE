-- Create helper function to check if user is president
CREATE OR REPLACE FUNCTION is_president(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'president'::user_role
  );
$$;

-- Create helper function to check if user is department head
CREATE OR REPLACE FUNCTION is_department_head(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'department_head'::user_role
  );
$$;

-- Create helper function to check if user is department head of specific department
CREATE OR REPLACE FUNCTION is_department_head_of(uid uuid, dept_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid 
    AND p.role = 'department_head'::user_role 
    AND p.department_id = dept_id
  );
$$;

-- Create auth trigger to sync new users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Extract username from email (format: username@miaoda.com)
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    NEW.raw_user_meta_data->>'email',
    'member'::public.user_role
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- RLS Policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "President has full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_president(auth.uid()));

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid())
    AND department_id IS NOT DISTINCT FROM (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- RLS Policies for departments table
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view departments" ON departments
  FOR SELECT USING (true);

CREATE POLICY "President can manage departments" ON departments
  FOR ALL TO authenticated USING (is_president(auth.uid()));

-- RLS Policies for groups table
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view groups" ON groups
  FOR SELECT USING (true);

CREATE POLICY "President can manage groups" ON groups
  FOR ALL TO authenticated USING (is_president(auth.uid()));

-- RLS Policies for scores table
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view scores" ON scores
  FOR SELECT USING (true);

CREATE POLICY "President can manage all scores" ON scores
  FOR ALL TO authenticated USING (is_president(auth.uid()));

CREATE POLICY "Department heads can manage their department scores" ON scores
  FOR ALL TO authenticated 
  USING (is_department_head_of(auth.uid(), department_id))
  WITH CHECK (is_department_head_of(auth.uid(), department_id));

-- RLS Policies for study_materials table
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public materials are viewable by everyone" ON study_materials
  FOR SELECT USING (is_public = true);

CREATE POLICY "Authenticated users can view all materials" ON study_materials
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "President can manage all materials" ON study_materials
  FOR ALL TO authenticated USING (is_president(auth.uid()));

CREATE POLICY "Department heads can manage their department materials" ON study_materials
  FOR ALL TO authenticated 
  USING (is_department_head_of(auth.uid(), department_id))
  WITH CHECK (is_department_head_of(auth.uid(), department_id));

-- RLS Policies for role_change_logs table
ALTER TABLE public.role_change_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "President can view all role change logs" ON role_change_logs
  FOR SELECT TO authenticated USING (is_president(auth.uid()));

CREATE POLICY "President can insert role change logs" ON role_change_logs
  FOR INSERT TO authenticated WITH CHECK (is_president(auth.uid()));

-- Create public view for leaderboard
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.group_id,
  g.display_name as group_name,
  COALESCE(SUM(s.score), 0) as total_score,
  RANK() OVER (ORDER BY COALESCE(SUM(s.score), 0) DESC) as rank
FROM profiles p
LEFT JOIN scores s ON p.id = s.user_id
LEFT JOIN groups g ON p.group_id = g.id
WHERE p.role != 'president'::user_role
GROUP BY p.id, p.username, p.full_name, p.group_id, g.display_name
ORDER BY total_score DESC;