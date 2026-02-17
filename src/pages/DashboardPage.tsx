import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';
import { getAllProfiles, getLeaderboard, getAllStudyMaterials } from '@/db/api';
import type { ProfileWithRelations, LeaderboardEntry, StudyMaterialWithRelations } from '@/types';

export default function DashboardPage() {
  const { profile, isPresident, isDepartmentHead, isGroupLeader } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalMaterials: 0,
    myRank: 0,
    myScore: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      const [profilesRes, materialsRes, leaderboardRes] = await Promise.all([
        getAllProfiles(),
        getAllStudyMaterials(),
        getLeaderboard(),
      ]);

      const myLeaderboardEntry = leaderboardRes.data.find(entry => entry.id === profile?.id);

      setStats({
        totalMembers: profilesRes.data.length,
        totalMaterials: materialsRes.data.length,
        myRank: myLeaderboardEntry?.rank || 0,
        myScore: myLeaderboardEntry?.total_score || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    if (isPresident) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">President Dashboard</h2>
            <p className="text-muted-foreground">
              Full system access and control over all organizational functions
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">Active organization members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMaterials}</div>
                <p className="text-xs text-muted-foreground">Available resources</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Groups</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">G1, G2, G3</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your organization efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-4 md:grid-cols-2">
                <a href="/admin/roles" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Role Management</h3>
                  <p className="text-sm text-muted-foreground">Assign or remove roles for members</p>
                </a>
                <a href="/materials" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Study Materials</h3>
                  <p className="text-sm text-muted-foreground">Upload and manage resources</p>
                </a>
                <a href="/leaderboard" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">View and manage member scores</p>
                </a>
                <a href="/members" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Members</h3>
                  <p className="text-sm text-muted-foreground">View all organization members</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isDepartmentHead) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Department Head Dashboard</h2>
            <p className="text-muted-foreground">
              {profile?.department?.display_name || 'Your Department'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMaterials}</div>
                <p className="text-xs text-muted-foreground">Available resources</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Rank</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{stats.myRank || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Current ranking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myScore}</div>
                <p className="text-xs text-muted-foreground">Total points</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Management</CardTitle>
              <CardDescription>Manage your department's resources and scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-4 md:grid-cols-2">
                <a href="/materials" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Upload Materials</h3>
                  <p className="text-sm text-muted-foreground">Add study resources for your department</p>
                </a>
                <a href="/leaderboard" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Manage Scores</h3>
                  <p className="text-sm text-muted-foreground">Update scores for your department</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isGroupLeader) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Group Leader Dashboard</h2>
            <p className="text-muted-foreground">
              {profile?.group?.display_name || 'Your Group'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMaterials}</div>
                <p className="text-xs text-muted-foreground">Available resources</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Rank</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{stats.myRank || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Current ranking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myScore}</div>
                <p className="text-xs text-muted-foreground">Total points</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Navigate to key sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-4 md:grid-cols-2">
                <a href="/materials" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Study Materials</h3>
                  <p className="text-sm text-muted-foreground">Access learning resources</p>
                </a>
                <a href="/leaderboard" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">View rankings and scores</p>
                </a>
                <a href="/members" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">Group Members</h3>
                  <p className="text-sm text-muted-foreground">View your group members</p>
                </a>
                <a href="/profile" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-1">My Profile</h3>
                  <p className="text-sm text-muted-foreground">Update your information</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Member dashboard
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Member Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to USC IX Management Platform
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
              <p className="text-xs text-muted-foreground">Available resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.myRank || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Current ranking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myScore}</div>
              <p className="text-xs text-muted-foreground">Total points</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Navigate to key sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-4 md:grid-cols-2">
              <a href="/materials" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold mb-1">Study Materials</h3>
                <p className="text-sm text-muted-foreground">Access learning resources</p>
              </a>
              <a href="/leaderboard" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold mb-1">Leaderboard</h3>
                <p className="text-sm text-muted-foreground">View rankings and scores</p>
              </a>
              <a href="/members" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold mb-1">Members</h3>
                <p className="text-sm text-muted-foreground">View organization members</p>
              </a>
              <a href="/profile" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold mb-1">My Profile</h3>
                <p className="text-sm text-muted-foreground">Update your information</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 px-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4">
        {getRoleSpecificContent()}
      </div>
    </MainLayout>
  );
}
