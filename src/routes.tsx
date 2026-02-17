import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import PublicMaterialsPage from './pages/PublicMaterialsPage';
import MembersPage from './pages/MembersPage';
import ProfilePage from './pages/ProfilePage';
import RoleManagementPage from './pages/RoleManagementPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <SignupPage />,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    name: 'Study Materials',
    path: '/materials',
    element: <StudyMaterialsPage />,
  },
  {
    name: 'Public Materials',
    path: '/materials/public',
    element: <PublicMaterialsPage />,
  },
  {
    name: 'Members',
    path: '/members',
    element: <MembersPage />,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    name: 'Role Management',
    path: '/admin/roles',
    element: <RoleManagementPage />,
  },
];

export default routes;
