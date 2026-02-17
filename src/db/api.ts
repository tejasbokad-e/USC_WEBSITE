import { supabase } from './supabase';
import type {
  Profile,
  ProfileWithRelations,
  Department,
  Group,
  Score,
  ScoreWithRelations,
  StudyMaterial,
  StudyMaterialWithRelations,
  RoleChangeLog,
  RoleChangeLogWithRelations,
  LeaderboardEntry,
  UpdateProfileInput,
  CreateScoreInput,
  UpdateScoreInput,
  CreateStudyMaterialInput,
  UpdateStudyMaterialInput,
  AssignRoleInput,
} from '@/types';

// ============= Auth =============

export async function signIn(username: string, password: string) {
  const email = `${username}@miaoda.com`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(username: string, password: string, fullName?: string, email?: string) {
  const authEmail = `${username}@miaoda.com`;
  const { data, error } = await supabase.auth.signUp({
    email: authEmail,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        email: email,
      },
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// ============= Profiles =============

export async function getProfile(userId: string): Promise<{ data: ProfileWithRelations | null; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(*),
      group:groups(*)
    `)
    .eq('id', userId)
    .maybeSingle();
  
  return { data, error };
}

export async function updateProfile(userId: string, updates: UpdateProfileInput) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  return { data, error };
}

export async function getAllProfiles(limit = 100, offset = 0): Promise<{ data: ProfileWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(*),
      group:groups(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getProfilesByRole(role: string, limit = 100): Promise<{ data: ProfileWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(*),
      group:groups(*)
    `)
    .eq('role', role)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getProfilesByGroup(groupId: string, limit = 100): Promise<{ data: ProfileWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(*),
      group:groups(*)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getProfilesByDepartment(departmentId: string, limit = 100): Promise<{ data: ProfileWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(*),
      group:groups(*)
    `)
    .eq('department_id', departmentId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

// ============= Departments =============

export async function getAllDepartments(): Promise<{ data: Department[]; error: any }> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('display_name', { ascending: true });
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getDepartment(id: string): Promise<{ data: Department | null; error: any }> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  return { data, error };
}

// ============= Groups =============

export async function getAllGroups(): Promise<{ data: Group[]; error: any }> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('name', { ascending: true });
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getGroup(id: string): Promise<{ data: Group | null; error: any }> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  return { data, error };
}

// ============= Scores =============

export async function createScore(input: CreateScoreInput) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('scores')
    .insert({
      ...input,
      created_by: user?.id,
    });
  
  return { error };
}

export async function updateScore(scoreId: string, updates: UpdateScoreInput) {
  const { data, error } = await supabase
    .from('scores')
    .update(updates)
    .eq('id', scoreId)
    .select()
    .maybeSingle();
  
  return { data, error };
}

export async function deleteScore(scoreId: string) {
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId);
  
  return { error };
}

export async function getUserScores(userId: string, limit = 50): Promise<{ data: ScoreWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('scores')
    .select(`
      *,
      department:departments(*),
      created_by_user:profiles!scores_created_by_fkey(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getDepartmentScores(departmentId: string, limit = 100): Promise<{ data: ScoreWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('scores')
    .select(`
      *,
      user:profiles!scores_user_id_fkey(*),
      department:departments(*),
      created_by_user:profiles!scores_created_by_fkey(*)
    `)
    .eq('department_id', departmentId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

// ============= Leaderboard =============

export async function getLeaderboard(limit = 100): Promise<{ data: LeaderboardEntry[]; error: any }> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getLeaderboardByGroup(groupId: string, limit = 100): Promise<{ data: LeaderboardEntry[]; error: any }> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('group_id', groupId)
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

// ============= Study Materials =============

export async function createStudyMaterial(input: CreateStudyMaterialInput) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('study_materials')
    .insert({
      ...input,
      uploaded_by: user?.id,
    })
    .select()
    .maybeSingle();
  
  return { data, error };
}

export async function updateStudyMaterial(materialId: string, updates: UpdateStudyMaterialInput) {
  const { data, error } = await supabase
    .from('study_materials')
    .update(updates)
    .eq('id', materialId)
    .select()
    .maybeSingle();
  
  return { data, error };
}

export async function deleteStudyMaterial(materialId: string) {
  const { error } = await supabase
    .from('study_materials')
    .delete()
    .eq('id', materialId);
  
  return { error };
}

export async function getPublicStudyMaterials(limit = 50, offset = 0): Promise<{ data: StudyMaterialWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('study_materials')
    .select(`
      *,
      department:departments(*),
      uploader:profiles!study_materials_uploaded_by_fkey(*)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getAllStudyMaterials(limit = 50, offset = 0): Promise<{ data: StudyMaterialWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('study_materials')
    .select(`
      *,
      department:departments(*),
      uploader:profiles!study_materials_uploaded_by_fkey(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { data: Array.isArray(data) ? data : [], error };
}

export async function getDepartmentStudyMaterials(departmentId: string, limit = 50): Promise<{ data: StudyMaterialWithRelations[]; error: any }> {
  const { data, error } = await supabase
    .from('study_materials')
    .select(`
      *,
      department:departments(*),
      uploader:profiles!study_materials_uploaded_by_fkey(*)
    `)
    .eq('department_id', departmentId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: Array.isArray(data) ? data : [], error };
}

// ============= Role Management =============

export async function assignRole(input: AssignRoleInput) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get current profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role, department_id')
    .eq('id', input.user_id)
    .maybeSingle();
  
  // Update profile
  const { data, error } = await supabase
    .from('profiles')
    .update({
      role: input.new_role,
      department_id: input.department_id || null,
    })
    .eq('id', input.user_id)
    .select()
    .maybeSingle();
  
  if (!error && currentProfile) {
    // Log role change
    await supabase
      .from('role_change_logs')
      .insert({
        user_id: input.user_id,
        old_role: currentProfile.role,
        new_role: input.new_role,
        old_department_id: currentProfile.department_id,
        new_department_id: input.department_id || null,
        changed_by: user?.id,
        reason: input.reason,
      });
  }
  
  return { data, error };
}

export async function removeRole(userId: string, reason?: string) {
  return assignRole({
    user_id: userId,
    new_role: 'member',
    reason,
  });
}

export async function getRoleChangeLogs(userId?: string, limit = 50): Promise<{ data: RoleChangeLogWithRelations[]; error: any }> {
  let query = supabase
    .from('role_change_logs')
    .select(`
      *,
      user:profiles!role_change_logs_user_id_fkey(*),
      changed_by_user:profiles!role_change_logs_changed_by_fkey(*),
      old_department:departments!role_change_logs_old_department_id_fkey(*),
      new_department:departments!role_change_logs_new_department_id_fkey(*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  
  return { data: Array.isArray(data) ? data : [], error };
}

// ============= Storage =============

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('study_materials')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) return { data: null, error };
  
  const { data: urlData } = supabase.storage
    .from('study_materials')
    .getPublicUrl(data.path);
  
  return { data: { path: data.path, url: urlData.publicUrl }, error: null };
}

export async function deleteFile(path: string) {
  const { error } = await supabase.storage
    .from('study_materials')
    .remove([path]);
  
  return { error };
}
