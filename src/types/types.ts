// Database types matching Supabase schema

export type UserRole = 'president' | 'department_head' | 'group_leader' | 'member';

export type DepartmentName = 'academic_enhancement_board' | 'sports_department' | 'activity_department' | 'hr_management';

export type GroupName = 'G1' | 'G2' | 'G3';

export interface Department {
  id: string;
  name: DepartmentName;
  display_name: string;
  description: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: GroupName;
  display_name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  department_id: string | null;
  group_id: string | null;
  group_change_count: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithRelations extends Profile {
  department?: Department | null;
  group?: Group | null;
}

export interface Score {
  id: string;
  user_id: string;
  department_id: string;
  score: number;
  reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScoreWithRelations extends Score {
  user?: Profile;
  department?: Department;
  created_by_user?: Profile;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  is_public: boolean;
  department_id: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterialWithRelations extends StudyMaterial {
  department?: Department | null;
  uploader?: Profile;
}

export interface RoleChangeLog {
  id: string;
  user_id: string;
  old_role: UserRole | null;
  new_role: UserRole;
  old_department_id: string | null;
  new_department_id: string | null;
  changed_by: string;
  reason: string | null;
  created_at: string;
}

export interface RoleChangeLogWithRelations extends RoleChangeLog {
  user?: Profile;
  changed_by_user?: Profile;
  old_department?: Department | null;
  new_department?: Department | null;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  full_name: string | null;
  group_id: string | null;
  group_name: string | null;
  total_score: number;
  rank: number;
}

// Form types
export interface UpdateProfileInput {
  full_name?: string;
  email?: string;
  group_id?: string;
  avatar_url?: string;
}

export interface CreateScoreInput {
  user_id: string;
  department_id: string;
  score: number;
  reason?: string;
}

export interface UpdateScoreInput {
  score?: number;
  reason?: string;
}

export interface CreateStudyMaterialInput {
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  is_public: boolean;
  department_id?: string;
}

export interface UpdateStudyMaterialInput {
  title?: string;
  description?: string;
  is_public?: boolean;
}

export interface AssignRoleInput {
  user_id: string;
  new_role: UserRole;
  department_id?: string;
  reason?: string;
}
