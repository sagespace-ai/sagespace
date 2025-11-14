# Authentication Guide

## Test Credentials

For development and testing, you can create a test account:

1. Visit `/auth/signup`
2. Use any valid email format (e.g., `test@sagespace.dev`)
3. Password must be at least 6 characters
4. Check your email for confirmation link

**Quick Test Account Setup:**
- Email: `demo@sagespace.dev`
- Password: `sagespace123`

Note: You must create the account first via the signup flow. Supabase requires email confirmation.

## Authentication Flows

### Login Flow
1. User enters email/password at `/auth/login`
2. Supabase validates credentials
3. On success → redirect to `/demo`
4. On failure → show error message

### Signup Flow
1. User enters email/password at `/auth/signup`
2. Supabase creates account
3. Confirmation email sent
4. User clicks confirmation link
5. User can now log in

### Password Reset
1. User clicks "Forgot password?" at `/auth/login`
2. Goes to `/auth/forgot-password`
3. Enters email
4. Receives reset email
5. Clicks link → redirected to `/auth/reset-password`
6. Sets new password
7. Redirected to login with success message

### Session Management
- Sessions are persistent across page reloads
- Protected routes check for valid session
- Invalid sessions redirect to `/auth/login` with return URL
- Sessions expire after 7 days of inactivity

## Error Handling

All auth pages handle:
- Invalid credentials
- Unconfirmed emails
- Network errors
- Expired tokens
- Missing fields

Error messages are user-friendly and actionable.

## Security

- Passwords are hashed by Supabase
- Sessions use HTTP-only cookies
- CSRF protection enabled
- Rate limiting on auth endpoints
- Email confirmation required
