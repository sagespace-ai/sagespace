# Test User Credentials

## Default Test Account

For development and testing purposes, a default test account is available:

**Email:** `test@sagespace.ai`  
**Password:** `TestPassword123!`

This account has:
- Level 3 with 1500 XP
- 5-day active streak
- Companion unlocked
- Onboarding completed
- Access to Architect, Merchant, and Creative Sages
- Sample timeline events and achievements

## Creating the Test User

### Option 1: Via Signup Flow
1. Navigate to `/auth/signup`
2. Enter the test credentials above
3. Complete email verification (if required)
4. Run the seed script: `scripts/029-seed-test-user.sql`

### Option 2: Via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Enter:
   - Email: `test@sagespace.ai`
   - Password: `TestPassword123!`
   - User UID: `00000000-0000-0000-0000-000000000001`
5. Confirm the email (or disable email confirmation)
6. Run the seed script to populate profile and progress data

### Option 3: Via Supabase CLI
\`\`\`bash
supabase auth signup test@sagespace.ai TestPassword123!
\`\`\`

Then run the seed script in the SQL editor or via CLI.

## Demo Mode

Users can also access Demo Mode from the login page without authentication to explore the platform features with limited functionality.
