# 🧪 Testing the Presidential Login - Step by Step

## Prerequisites
- Platform is deployed and accessible
- Database is initialized with departments and groups

---

## Test Procedure

### Test 1: Initialize President Account

**Steps:**
1. Open your browser and navigate to the platform homepage
2. Click the **"🔧 Setup Platform"** button (or go to `/setup`)
3. You should see the "Platform Setup" page with a shield icon
4. Click the **"Initialize President Account"** button
5. Wait for the process to complete (should take 2-3 seconds)

**Expected Result:**
- ✅ Success message appears: "President account created successfully!"
- ✅ Credentials are displayed:
  - Username: `usc.president_ix`
  - Password: `presidential.login_uscix`
- ✅ Two buttons appear: "Go to Login" and "Go to Home"

**If it fails:**
- Check browser console for errors
- Verify Supabase connection is working
- Try refreshing the page and clicking again

---

### Test 2: Login as President

**Steps:**
1. Click **"Go to Login"** button (or navigate to `/login`)
2. Enter the credentials EXACTLY as shown:
   ```
   Username: usc.president_ix
   Password: presidential.login_uscix
   ```
3. Click **"Sign In"** button

**Expected Result:**
- ✅ Success toast notification: "Login successful!"
- ✅ Redirected to `/dashboard`
- ✅ See "President Dashboard" heading
- ✅ Navigation menu shows:
  - Dashboard
  - Study Materials
  - Leaderboard
  - Members
  - Role Management (President only)
- ✅ User dropdown shows:
  - Name: "USC IX President" or "usc.president_ix"
  - Role: "President"

**If login fails:**
- ❌ "Invalid username or password" → Check for typos, ensure lowercase 'ix'
- ❌ No response → Check network tab for API errors
- ❌ Redirects to login → Check if account was created in Step 1

---

### Test 3: Verify President Permissions

**Test 3.1: Access Role Management**
1. Click **"Role Management"** in the navigation menu
2. You should see the Role Management page with:
   - Department Heads section (4 departments)
   - Group Leaders section (3 groups)
   - All Members table
   - "View History" button

**Test 3.2: Access Leaderboard with Add Score**
1. Click **"Leaderboard"** in the navigation
2. You should see:
   - Leaderboard table
   - **"Add Score"** button (President only)

**Test 3.3: Access Study Materials with Upload**
1. Click **"Study Materials"** in the navigation
2. You should see:
   - Materials grid/list
   - **"Upload Material"** button (President only)

**Expected Result:**
- ✅ All pages are accessible
- ✅ All admin buttons are visible
- ✅ No permission errors

---

### Test 4: Dashboard Statistics

**Steps:**
1. Go to Dashboard (`/dashboard`)
2. Check the statistics cards

**Expected Result:**
- ✅ "Total Members" card shows count (at least 1 - the president)
- ✅ "Study Materials" card shows count (0 if none uploaded)
- ✅ "Departments" card shows: 4
- ✅ "Groups" card shows: 3
- ✅ Quick Actions section with 4 links:
  - Role Management
  - Study Materials
  - Leaderboard
  - Members

---

### Test 5: Logout and Re-login

**Steps:**
1. Click on the user avatar/name in the top-right corner
2. Click **"Sign Out"** from the dropdown
3. You should be redirected to `/login`
4. Login again with the same credentials:
   ```
   Username: usc.president_ix
   Password: presidential.login_uscix
   ```

**Expected Result:**
- ✅ Logout successful
- ✅ Re-login successful
- ✅ Session persists correctly

---

## Common Issues and Solutions

### Issue 1: "Invalid username or password"

**Solution:**
```
✓ Correct:  usc.president_ix (lowercase 'ix')
✗ Wrong:    usc.president_IX (uppercase 'IX')
✗ Wrong:    usc.president_Ix (mixed case)
```

### Issue 2: Setup button does nothing

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify Edge Function is deployed
4. Check Supabase connection

### Issue 3: Login successful but redirects back to login

**Solution:**
1. Check if profile was created with role='president'
2. Run this SQL query to verify:
   ```sql
   SELECT id, username, role FROM profiles WHERE username = 'usc.president_ix';
   ```
3. Should return one row with role='president'

### Issue 4: Can't see Role Management menu

**Solution:**
1. Verify you're logged in as president
2. Check user dropdown - should show "President" role
3. If not, the profile role might not be set correctly

---

## Database Verification Queries

If you need to verify the setup manually:

```sql
-- Check if president exists in profiles
SELECT id, username, role, created_at 
FROM profiles 
WHERE username = 'usc.president_ix';

-- Check if president exists in auth.users
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'usc.president_ix@miaoda.com';

-- Check departments
SELECT name, display_name FROM departments ORDER BY display_name;

-- Check groups
SELECT name, display_name FROM groups ORDER BY name;
```

Expected results:
- 1 president profile with role='president'
- 1 auth user with confirmed email
- 4 departments
- 3 groups

---

## Success Criteria

✅ **All tests pass if:**
1. Setup page creates account successfully
2. Login works with correct credentials
3. President dashboard loads with all statistics
4. All navigation menu items are accessible
5. Admin-only buttons (Add Score, Upload Material, Role Management) are visible
6. Logout and re-login works correctly

---

## Next Steps After Successful Login

1. **Create test members**: Go to `/signup` and create a few test accounts
2. **Assign roles**: Use Role Management to assign Department Heads and Group Leaders
3. **Upload materials**: Test the study materials upload feature
4. **Add scores**: Test the leaderboard score management

---

**Testing Date**: _____________
**Tester Name**: _____________
**Result**: ☐ Pass ☐ Fail
**Notes**: _____________________________________________

