# Organizational Management and Study Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name
USC IX Management Platform

### 1.2 Application Description
A fully device-responsive organizational management and study platform designed for managing members, academic study materials, departments, groups, roles, scores, and leadership hierarchy in a clean, secure, role-based system.

### 1.3 Target Devices
- Mobile devices
- Tablets
- Desktop computers

## 2. User Roles and Access Control

### 2.1 President (Super Admin)
**Login Credentials (Fixed and Predefined):**
- President ID: usc.president_IX
- Password: presidential.login_uscix

**Key Rules:**
- Only ONE President exists in the system
- President has FULL SYSTEM ACCESS
- Cannot be removed or downgraded by anyone
- Requires separate secure admin login interface

**Permissions:**
- Assign or remove roles for any member
- Appoint or replace Department Heads
- Appoint or replace Group Leaders
- View, edit, and manage all departments
- Override scores and permissions
- Access all study materials, analytics, and admin panels

### 2.2 Department Heads
**Departments (4 Total):**
1. Academic Enhancement Board
2. Sports Department
3. Activity Department
4. HR Management

**Key Rules:**
- Only ONE Department Head per department
- Department Heads are appointed ONLY by the President

**Permissions:**
- Change and manage scores related to their department
- Upload, update, and manage study or training materials for their department
- View members under their department
- Cannot assign roles
- Cannot access other departments' admin controls

### 2.3 Group Leaders
**Groups (3 Total):**
- G1
- G2
- G3

**Key Rules:**
- Each group can have ONE Group Leader
- Group Leaders are appointed ONLY by the President

**Permissions:**
- Higher access than normal members
- View group member list
- Assist in coordination and monitoring
- NO score editing
- NO role assignment
- NO admin overrides

### 2.4 Members
**Permissions:**
- Normal access only
- View and download academic PDFs
- View study materials, announcements, and dashboards
- Cannot change scores
- Cannot assign roles

**Important Notes:**
- NO badge system exists
- NO ranking manipulation by members

## 3. Core Features

### 3.1 Study Materials and PDFs
- Academic PDFs are PUBLICLY downloadable by anyone (no login required)
- Members get additional access to internal materials after login
- Study material uploads are controlled by Department Heads and President
- No limit to size of PDF uploads

### 3.2 Group Selection Feature
**For Members:**
- During signup or profile setup, members can SELECT their group (G1, G2, or G3)
- Group selection can be changed only once by the member
- Further changes require President approval
- Group assignment affects dashboards and visibility

### 3.3 Role Management Panel
**Access:**
- Accessible ONLY by President

**Functionality:**
- Assign Department Head role to a member
- Assign Group Leader role to a member
- Remove or replace existing role holders

**System Enforcement:**
- One Department Head per department
- One Group Leader per group
- Role change history must be logged (timestamp + changed by President)

### 3.4 Leaderboard and Scores
**Display Information:**
- Member Name
- Rank
- Total Score

**Key Rules:**
- No badges
- Score editing allowed ONLY by President and respective Department Head

### 3.5 Dashboard System
**Separate Dashboards for:**
- President
- Department Heads
- Group Leaders
- Members

**Features:**
- Clear role indicators (text-based, not badges)
- Role-specific content and controls

## 4. UI/UX Requirements

### 4.1 Design Principles
- Fully responsive (mobile-first design)
- Clean, professional, minimal UI
- Clear visual hierarchy
- Intuitive navigation

### 4.2 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 5. Security and Logic Rules

### 5.1 Security Requirements
- Role-based access control enforced at backend level
- President credentials are hardcoded and protected
- Members cannot elevate privileges
- All critical actions require authentication
- Public PDFs remain accessible without login

### 5.2 Access Control Logic
- Authentication required for all role-specific features
- Authorization checks on every protected endpoint
- Session management and timeout handling
- Secure password storage and handling

## 6. Technical Requirements

### 6.1 File Upload
- Support PDF file uploads with no size limit
- Secure file storage and retrieval
- Public access URLs for downloadable PDFs

### 6.2 Data Management
- Member profiles and group assignments
- Role assignments and change history
- Score tracking and leaderboard calculations
- Study materials and department-specific content

### 6.3 Logging and Audit
- Role change history (timestamp + changed by President)
- Critical action logs for security and accountability

## 7. System Architecture Goals

### 7.1 Core Principles
- Scalable architecture
- Secure role-based access control
- Professional-grade organizational platform
- Clear hierarchy enforcement
- Strong role control mechanisms
- Academic focus
- Zero unnecessary features
- Clean and maintainable codebase