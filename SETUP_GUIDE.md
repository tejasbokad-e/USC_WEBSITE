# USC IX Management Platform - Setup & Login Guide

## 🚀 Quick Start Guide

### Step 1: Initialize the President Account

**IMPORTANT**: Before anyone can use the platform, you must initialize the President account.

1. Navigate directly to: **`/setup`** (type in browser address bar)
2. Click the **"Initialize President Account"** button
3. Wait for the confirmation message
4. **Save the credentials** displayed on screen:
   - **Username**: `usc.president_ix`
   - **Password**: `presidential.login_uscix`

**Note**: The setup page is only accessible via direct URL for security reasons.

### Step 2: Login as President

1. Go to the **Login page** (`/login`)
2. Enter the credentials:
   - **Username**: `usc.president_ix`
   - **Password**: `presidential.login_uscix`
3. Click **"Sign In"**
4. You will be redirected to the President Dashboard

---

## 👤 User Roles & Access

### President (Super Admin)
- **Login**: Use the fixed credentials above
- **Capabilities**:
  - Full system access
  - Assign/remove Department Heads and Group Leaders
  - Manage all scores across all departments
  - Upload materials for any department
  - View all members and analytics

### Department Heads
- **How to become one**: President assigns this role
- **Capabilities**:
  - Upload materials for their department
  - Manage scores for their department
  - View department members
  - Cannot assign roles

### Group Leaders
- **How to become one**: President assigns this role
- **Capabilities**:
  - View group members
  - Coordinate group activities
  - Cannot edit scores or assign roles

### Members
- **How to join**: Sign up at `/signup`
- **Capabilities**:
  - View and download study materials
  - View leaderboard and rankings
  - Select group (changeable once)
  - View member directory

---

## 📋 Common Tasks

### For President: Assign Department Heads

1. Login as President
2. Navigate to **"Role Management"** from the menu
3. Find the member in the "All Members" table
4. Click **"Manage"** next to their name
5. Select **"Department Head"** from the Role dropdown
6. Select the **Department** they will manage
7. Optionally add a reason
8. Click **"Assign Role"**

### For President: Assign Group Leaders

1. Login as President
2. Navigate to **"Role Management"**
3. Find the member who should be a Group Leader
4. Click **"Manage"**
5. Select **"Group Leader"** from the Role dropdown
6. Click **"Assign Role"**
7. Note: The member must already be in a group (G1, G2, or G3)

### For President/Department Heads: Add Scores

1. Navigate to **"Leaderboard"**
2. Click **"Add Score"** button
3. Select the **Member**
4. Select the **Department**
5. Enter the **Score** (can be positive or negative)
6. Optionally add a **Reason**
7. Click **"Add Score"**

### For President/Department Heads: Upload Study Materials

1. Navigate to **"Study Materials"**
2. Click **"Upload Material"**
3. Fill in:
   - **Title** (required)
   - **Description** (optional)
   - **Department** (optional, defaults to your department for Dept Heads)
   - **Public Access** toggle (if enabled, anyone can view without login)
   - **File** (PDF only, no size limit)
4. Click **"Upload"**

### For Members: Select Group

1. Login to your account
2. Navigate to **"My Profile"**
3. Select your group from the **Group** dropdown (G1, G2, or G3)
4. Click **"Save Changes"**
5. Note: You can only change your group **once**. After that, contact the President.

---

## 🔒 Security Notes

- **President credentials are fixed** and cannot be changed through the UI
- Only **ONE President** exists in the system
- **One Department Head per department** (4 departments total)
- **One Group Leader per group** (3 groups total)
- All role changes are **logged** with timestamp and reason
- Members **cannot elevate their own privileges**

---

## 🆘 Troubleshooting

### "Invalid username or password" when logging in as President

1. Make sure you've run the **Setup** process first (`/setup`)
2. Verify you're using the exact credentials:
   - Username: `usc.president_ix` (case-sensitive)
   - Password: `presidential.login_uscix` (case-sensitive)
3. If still not working, run the Setup again (it's safe to run multiple times)

### Cannot assign Department Head - "Department already has a head"

- Each department can only have ONE Department Head
- Remove the existing Department Head first, then assign the new one
- Go to Role Management → Find the current head → Click "Remove"

### Cannot change group more than once

- This is by design for organizational stability
- Contact the President to manually update your group
- President can update any member's group through direct profile editing

### Study material upload fails

- Ensure the file is a **PDF** format
- Check your internet connection
- Verify you have the correct permissions (President or Department Head)
- Try a smaller file first to test

---

## 📞 Support

For administrative requests or issues:
- **Role assignments**: Contact the President
- **Group changes** (after first change): Contact the President
- **Technical issues**: Check the browser console for error messages

---

## 🎯 Platform Structure

**4 Departments:**
1. Academic Enhancement Board
2. Sports Department
3. Activity Department
4. HR Management

**3 Groups:**
1. G1 (Group 1)
2. G2 (Group 2)
3. G3 (Group 3)

**Role Hierarchy:**
President → Department Heads → Group Leaders → Members

---

© 2026 USC IX Management Platform
