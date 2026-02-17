import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Plus } from 'lucide-react';
import { getLeaderboard, createScore, getAllDepartments } from '@/db/api';
import type { LeaderboardEntry, Department } from '@/types';
import { toast } from 'sonner';

export default function LeaderboardPage() {
  const { profile, isPresident, isDepartmentHead } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAddScore, setShowAddScore] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [scoreForm, setScoreForm] = useState({
    department_id: '',
    score: '',
    reason: '',
  });

  const canEditScores = isPresident || isDepartmentHead;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leaderboardRes, departmentsRes] = await Promise.all([
        getLeaderboard(),
        getAllDepartments(),
      ]);

      setLeaderboard(leaderboardRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async () => {
    if (!selectedUserId || !scoreForm.department_id || !scoreForm.score) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await createScore({
        user_id: selectedUserId,
        department_id: scoreForm.department_id,
        score: Number.parseFloat(scoreForm.score),
        reason: scoreForm.reason || undefined,
      });

      if (error) {
        toast.error('Failed to add score');
        return;
      }

      toast.success('Score added successfully');
      setShowAddScore(false);
      setScoreForm({ department_id: '', score: '', reason: '' });
      setSelectedUserId('');
      loadData();
    } catch (error) {
      console.error('Failed to add score:', error);
      toast.error('Failed to add score');
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">Member rankings and scores</p>
          </div>
          {canEditScores && (
            <Button onClick={() => setShowAddScore(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Score
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
            <CardDescription>Top performers in the organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboard.map((entry) => (
                      <TableRow key={entry.id} className={entry.id === profile?.id ? 'bg-muted/50' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.rank)}
                            <span className="font-medium">#{entry.rank}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{entry.username}</TableCell>
                        <TableCell>{entry.full_name || '-'}</TableCell>
                        <TableCell>{entry.group_name || '-'}</TableCell>
                        <TableCell className="text-right font-bold">{entry.total_score}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Score Dialog */}
        <Dialog open={showAddScore} onOpenChange={setShowAddScore}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Score</DialogTitle>
              <DialogDescription>Add points to a member's score</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Member</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaderboard.map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.username} - {entry.full_name || 'No name'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={scoreForm.department_id}
                  onValueChange={(value) => setScoreForm({ ...scoreForm, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter(dept => {
                        if (isPresident) return true;
                        if (isDepartmentHead) return dept.id === profile?.department_id;
                        return false;
                      })
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.display_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Score</Label>
                <Input
                  type="number"
                  placeholder="Enter score"
                  value={scoreForm.score}
                  onChange={(e) => setScoreForm({ ...scoreForm, score: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Input
                  placeholder="Reason for score"
                  value={scoreForm.reason}
                  onChange={(e) => setScoreForm({ ...scoreForm, reason: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddScore(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddScore}>Add Score</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
