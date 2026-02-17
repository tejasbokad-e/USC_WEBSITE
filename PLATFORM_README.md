# USC IX Management Platform

A comprehensive organizational management and study platform designed for managing members, academic study materials, departments, groups, roles, and leadership hierarchy in a clean, secure, role-based system.

## Features

### 🔐 Role-Based Access Control
- **President**: Full system access with ability to assign/remove roles
- **Department Heads**: Manage department materials and scores
- **Group Leaders**: Coordinate group members
- **Members**: Access materials and view rankings

### 📚 Study Materials Management
- Public materials accessible without login
- Internal materials for authenticated members
- PDF upload with no size limit
- Department-specific organization

### 🏆 Leaderboard System
- Real-time member rankings
- Score management by President and Department Heads
- Group-based filtering
- Performance tracking

### 👥 Member Management
- Profile management with group selection
- Member directory with filtering
- Role assignment and tracking
- Change history logging

### 🏢 Organizational Structure
**4 Departments:**
- Academic Enhancement Board
- Sports Department
- Activity Department
- HR Management

**3 Groups:**
- G1 (Group 1)
- G2 (Group 2)
- G3 (Group 3)

## President Account

**Fixed Credentials (Pre-configured):**
- Username: `usc.president_ix`
- Password: `presidential.login_uscix`

⚠️ **Important**: Only ONE President exists in the system with full administrative access.

## Getting Started

### For Members

1. **Sign Up**: Create an account at `/signup`
2. **Select Group**: Choose your group (G1, G2, or G3) - can be changed once
3. **Access Materials**: Browse and download study materials
4. **View Rankings**: Check your position on the leaderboard

### For President

1. **Login**: Use the fixed president credentials
2. **Assign Roles**: Navigate to Role Management to assign Department Heads and Group Leaders
3. **Manage Scores**: Add or modify member scores across departments
4. **Upload Materials**: Add study resources for all departments

### For Department Heads

1. **Login**: Use your assigned credentials
2. **Upload Materials**: Add resources for your department
3. **Manage Scores**: Update scores for your department members

### For Group Leaders

1. **Login**: Use your assigned credentials
2. **View Members**: Monitor your group members
3. **Coordinate**: Assist in group coordination and monitoring

## Key Rules

### Role Assignment
- Only the President can assign or remove roles
- One Department Head per department
- One Group Leader per group
- Members cannot elevate their own privileges

### Group Selection
- Members can select their group during signup
- Group can be changed only once by the member
- Further changes require President approval

### Score Management
- Only President and respective Department Head can edit scores
- All score changes are logged with timestamp and reason

### Study Materials
- Public materials: Accessible to everyone (no login required)
- Internal materials: Accessible to authenticated members only
- Upload permissions: President and Department Heads only

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Username + Password (no email verification)
- **File Storage**: Supabase Storage (PDFs)

## Security Features

- Row Level Security (RLS) policies enforced at database level
- Role-based access control on all protected endpoints
- Secure password storage with bcrypt
- Session management with automatic timeout
- Audit logging for critical actions

## Pages

- `/` - Home page with platform overview
- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - Role-specific dashboard
- `/materials` - Study materials (authenticated)
- `/materials/public` - Public materials (no auth)
- `/leaderboard` - Member rankings
- `/members` - Member directory
- `/profile` - User profile management
- `/admin/roles` - Role management (President only)

## Design Philosophy

- **Clean & Professional**: Academic-focused design with navy blue primary color
- **Mobile-First**: Fully responsive across all devices
- **Text-Based Indicators**: No badge system, clear role labels
- **Intuitive Navigation**: Easy access to all features
- **Performance**: Optimized queries and pagination

## Support

For role assignments, group changes, or other administrative requests, please contact the President.

---

© 2026 USC IX Management Platform. All rights reserved.
