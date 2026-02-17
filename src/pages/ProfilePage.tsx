import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Users, AlertCircle } from 'lucide-react';
import { getAllGroups, updateProfile } from '@/db/api';
import type { Group } from '@/types';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    group_id: '',
  });

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      const { data: groupsData } = await getAllGroups();
      setGroups(groupsData);

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || '',
          group_id: profile.group_id || '',
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    try {
      // Check if group is being changed
      const isGroupChanging = formData.group_id !== profile.group_id;

      if (isGroupChanging && profile.group_change_count >= 1) {
        toast.error('You can only change your group once. Contact the President for further changes.');
        setSaving(false);
        return;
      }

      const updates: any = {
        full_name: formData.full_name || null,
        email: formData.email || null,
      };

      if (isGroupChanging) {
        updates.group_id = formData.group_id || null;
      }

      const { error } = await updateProfile(profile.id, updates);

      if (error) {
        toast.error('Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully');
      await refreshProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = () => {
    if (!profile) return 'Member';
    const badges: Record<string, string> = {
      president: 'President',
      department_head: 'Department Head',
      group_leader: 'Group Leader',
      member: 'Member',
    };
    return badges[profile.role] || profile.role;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 px-4 max-w-2xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{profile?.username}</span>
                </div>
                <p className="text-xs text-muted-foreground">Username cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{getRoleBadge()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Role is assigned by the President</p>
              </div>

              {profile?.department && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <span className="font-medium">{profile.department.display_name}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group Selection</CardTitle>
              <CardDescription>Choose your group (can be changed once)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile && profile.group_change_count >= 1 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have already changed your group once. Contact the President for further changes.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select
                  value={formData.group_id}
                  onValueChange={(value) => setFormData({ ...formData, group_id: value })}
                  disabled={profile ? profile.group_change_count >= 1 : false}
                >
                  <SelectTrigger id="group">
                    <SelectValue placeholder="Select your group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Current group: {profile?.group?.display_name || 'Not selected'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
