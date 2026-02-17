import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search } from 'lucide-react';
import { getAllProfiles, getAllGroups, getAllDepartments } from '@/db/api';
import type { ProfileWithRelations, Group, Department } from '@/types';
import { toast } from 'sonner';

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<ProfileWithRelations[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ProfileWithRelations[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filterGroup, filterRole]);

  const loadData = async () => {
    try {
      const [membersRes, groupsRes, departmentsRes] = await Promise.all([
        getAllProfiles(),
        getAllGroups(),
        getAllDepartments(),
      ]);

      setMembers(membersRes.data);
      setFilteredMembers(membersRes.data);
      setGroups(groupsRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Failed to load members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Group filter
    if (filterGroup !== 'all') {
      filtered = filtered.filter((member) => member.group_id === filterGroup);
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((member) => member.role === filterRole);
    }

    setFilteredMembers(filtered);
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      president: 'President',
      department_head: 'Department Head',
      group_leader: 'Group Leader',
      member: 'Member',
    };
    return badges[role] || role;
  };

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Members</h1>
          <p className="text-muted-foreground">View all organization members</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="president">President</SelectItem>
                  <SelectItem value="department_head">Department Head</SelectItem>
                  <SelectItem value="group_leader">Group Leader</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member List</CardTitle>
            <CardDescription>
              Showing {filteredMembers.length} of {members.length} members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.username}</TableCell>
                        <TableCell>{member.full_name || '-'}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {getRoleBadge(member.role)}
                          </span>
                        </TableCell>
                        <TableCell>{member.group?.display_name || '-'}</TableCell>
                        <TableCell>{member.department?.display_name || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
