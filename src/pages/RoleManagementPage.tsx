import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, UserCog, AlertCircle, History } from 'lucide-react';
import { getAllProfiles, getAllDepartments, assignRole, removeRole, getRoleChangeLogs } from '@/db/api';
import type { ProfileWithRelations, Department, RoleChangeLogWithRelations } from '@/types';
import { toast } from 'sonner';

export default function RoleManagementPage() {
  const { isPresident } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<ProfileWithRelations[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [logs, setLogs] = useState<RoleChangeLogWithRelations[]>([]);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ProfileWithRelations | null>(null);
  const [roleForm, setRoleForm] = useState({
    role: '',
    department_id: '',
    reason: '',
  });

  useEffect(() => {
    if (!isPresident) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [isPresident]);

  const loadData = async () => {
    try {
      const [membersRes, departmentsRes, logsRes] = await Promise.all([
        getAllProfiles(),
        getAllDepartments(),
        getRoleChangeLogs(),
      ]);

      setMembers(membersRes.data.filter(m => m.role !== 'president'));
      setDepartments(departmentsRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedMember || !roleForm.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate department head assignment
    if (roleForm.role === 'department_head' && !roleForm.department_id) {
      toast.error('Please select a department for Department Head role');
      return;
    }

    // Check if department already has a head
    if (roleForm.role === 'department_head') {
      const existingHead = members.find(
        m => m.role === 'department_head' && m.department_id === roleForm.department_id && m.id !== selectedMember.id
      );
      if (existingHead) {
        toast.error('This department already has a head. Remove the existing head first.');
        return;
      }
    }

    // Check if group already has a leader
    if (roleForm.role === 'group_leader' && selectedMember.group_id) {
      const existingLeader = members.find(
        m => m.role === 'group_leader' && m.group_id === selectedMember.group_id && m.id !== selectedMember.id
      );
      if (existingLeader) {
        toast.error('This group already has a leader. Remove the existing leader first.');
        return;
      }
    }

    try {
      const { error } = await assignRole({
        user_id: selectedMember.id,
        new_role: roleForm.role as any,
        department_id: roleForm.department_id || undefined,
        reason: roleForm.reason || undefined,
      });

      if (error) {
        toast.error('Failed to assign role');
        return;
      }

      toast.success('Role assigned successfully');
      setShowAssignRole(false);
      setSelectedMember(null);
      setRoleForm({ role: '', department_id: '', reason: '' });
      loadData();
    } catch (error) {
      console.error('Failed to assign role:', error);
      toast.error('Failed to assign role');
    }
  };

  const handleRemoveRole = async (member: ProfileWithRelations) => {
    if (!confirm(`Remove ${member.username}'s role and set them as a regular member?`)) return;

    try {
      const { error } = await removeRole(member.id, 'Role removed by President');

      if (error) {
        toast.error('Failed to remove role');
        return;
      }

      toast.success('Role removed successfully');
      loadData();
    } catch (error) {
      console.error('Failed to remove role:', error);
      toast.error('Failed to remove role');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      department_head: 'Department Head',
      group_leader: 'Group Leader',
      member: 'Member',
    };
    return badges[role] || role;
  };

  if (!isPresident) {
    return null;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 px-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Role Management</h1>
            <p className="text-muted-foreground">Assign and manage member roles</p>
          </div>
          <Button onClick={() => setShowLogs(true)} variant="outline">
            <History className="mr-2 h-4 w-4" />
            View History
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Each department can have only ONE Department Head, and each group can have only ONE Group Leader.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Heads</CardTitle>
              <CardDescription>One per department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {departments.map((dept) => {
                  const head = members.find(m => m.role === 'department_head' && m.department_id === dept.id);
                  return (
                    <div key={dept.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{dept.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {head ? head.username : 'No head assigned'}
                        </p>
                      </div>
                      {head && (
                        <Button size="sm" variant="outline" onClick={() => handleRemoveRole(head)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group Leaders</CardTitle>
              <CardDescription>One per group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['G1', 'G2', 'G3'].map((groupName) => {
                  const leader = members.find(m => m.role === 'group_leader' && m.group?.name === groupName);
                  return (
                    <div key={groupName} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Group {groupName}</p>
                        <p className="text-sm text-muted-foreground">
                          {leader ? leader.username : 'No leader assigned'}
                        </p>
                      </div>
                      {leader && (
                        <Button size="sm" variant="outline" onClick={() => handleRemoveRole(leader)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Members</CardTitle>
            <CardDescription>Assign roles to members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.username}</TableCell>
                      <TableCell>{member.full_name || '-'}</TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>{member.group?.display_name || '-'}</TableCell>
                      <TableCell>{member.department?.display_name || '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setRoleForm({
                              role: member.role,
                              department_id: member.department_id || '',
                              reason: '',
                            });
                            setShowAssignRole(true);
                          }}
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Assign Role Dialog */}
        <Dialog open={showAssignRole} onOpenChange={setShowAssignRole}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Role: {selectedMember?.username}</DialogTitle>
              <DialogDescription>Assign or change member role</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={roleForm.role} onValueChange={(value) => setRoleForm({ ...roleForm, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="group_leader">Group Leader</SelectItem>
                    <SelectItem value="department_head">Department Head</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {roleForm.role === 'department_head' && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={roleForm.department_id}
                    onValueChange={(value) => setRoleForm({ ...roleForm, department_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Textarea
                  placeholder="Reason for role change"
                  value={roleForm.reason}
                  onChange={(e) => setRoleForm({ ...roleForm, reason: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignRole(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignRole}>Assign Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Change History Dialog */}
        <Dialog open={showLogs} onOpenChange={setShowLogs}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Role Change History</DialogTitle>
              <DialogDescription>Complete log of all role changes</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No role changes recorded</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{log.user?.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {getRoleBadge(log.old_role || 'member')} → {getRoleBadge(log.new_role)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                    {log.reason && (
                      <p className="text-sm text-muted-foreground">Reason: {log.reason}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Changed by: {log.changed_by_user?.username}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
