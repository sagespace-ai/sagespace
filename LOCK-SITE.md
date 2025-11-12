# How to Lock Your Site from Public View

SageSpace includes a password protection system that lets you keep the site private while you build.

## Enable Password Protection

Add these environment variables to your Vercel project:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add these two variables:

\`\`\`
ENABLE_ACCESS_GATE=true
SITE_ACCESS_PASSWORD=your-secure-password-here
\`\`\`

4. Redeploy your site

## What Happens

- All visitors will see a password gate before accessing any page
- Once they enter the correct password, they get access for 7 days (cookie-based)
- The gate has a beautiful cosmic design matching your SageSpace aesthetic

## Disable Password Protection

When you're ready to launch publicly:

1. Set `ENABLE_ACCESS_GATE=false` in Vercel
2. Or simply remove both environment variables
3. Redeploy

## Testing Locally

Add to your `.env.local` file:

\`\`\`
ENABLE_ACCESS_GATE=true
SITE_ACCESS_PASSWORD=test123
\`\`\`

Then restart your development server.

## Security Notes

- The password is stored server-side only (never exposed to clients)
- Access is granted via secure HTTP-only cookies
- Cookies expire after 7 days
- This is perfect for development/staging, but consider proper authentication for production
