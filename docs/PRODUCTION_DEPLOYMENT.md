# SageSpace Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set in your production environment:

**Database (Supabase)**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**AI (Groq)**
- `API_KEY_GROQ_API_KEY`

**Payments (Stripe)**
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Feature Flags**
- `ENABLE_ACCESS_GATE` - Set to 'true' for waitlist mode
- `ENABLE_IMAGE_GEN` - Enable AI image generation
- `ENABLE_VIDEO_GEN` - Enable AI video generation
- `ENABLE_AUDIO_GEN` - Enable AI audio generation

**Models**
- `TEXT_MODEL` - Default: "openai/gpt-4o-mini"
- `AUDIO_MODEL` - Default: "openai/whisper-1"
- `IMAGE_MODEL` - Default: "openai/dall-e-3"
- `VIDEO_MODEL` - Default: "runway/gen-3"

**Auth**
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production URL

### 2. Database Setup

Run all migration scripts in order:
\`\`\`bash
# Execute scripts in order from /scripts directory
psql $DATABASE_URL -f scripts/000-initialize-database.sql
psql $DATABASE_URL -f scripts/001-rbac-setup.sql
# ... continue through all scripts
\`\`\`

### 3. Stripe Setup

1. Create products in Stripe for each tier:
   - Explorer: $4.99/month
   - Voyager: $14.99/month
   - Astral: $29.99/month
   - Oracle: $69.99/month
   - Celestial: $149.99/month

2. Update environment variables with price IDs

3. Configure webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

### 4. Performance Optimization

The platform includes:
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Bundle size optimization via webpack config
- Performance monitoring via `/api/analytics/performance`

### 5. Monitoring

**Performance Tracking**
- Core Web Vitals are automatically tracked
- API route performance is logged
- Client-side metrics sent to `/api/analytics/performance`

**Error Tracking**
- React error boundaries catch component errors
- Global error handler tracks all errors
- Error reports stored in `error_reports` table
- View errors via admin dashboard

### 6. Security

**Charter Compliance**
- Zero cryptocurrency features
- No trading or speculation
- FTC-compliant affiliate disclosures
- Transparent pricing

**Data Protection**
- Row Level Security (RLS) enabled on all tables
- User data isolated by user_id
- Admin-only access to sensitive data

**Rate Limiting**
- API routes protected by middleware
- Stripe webhook verification
- Supabase RLS policies

### 7. Deployment Steps

1. **Build Locally First**
\`\`\`bash
pnpm build
\`\`\`

2. **Test Production Build**
\`\`\`bash
pnpm start
\`\`\`

3. **Deploy to Vercel**
\`\`\`bash
vercel --prod
\`\`\`

4. **Run Post-Deployment Checks**
- Verify all pages load
- Test authentication flow
- Test subscription purchase flow
- Verify Dreamer proposals generate
- Check error tracking
- Verify performance monitoring

### 8. Post-Deployment Monitoring

Monitor these metrics daily:
- Error rate in `error_reports` table
- Performance metrics in `performance_metrics`
- User sign-ups and subscription conversions
- Dreamer proposal approval rate
- Design karma distribution

### 9. Rollback Plan

If issues occur:
1. Revert to previous Vercel deployment via dashboard
2. Check error logs in Supabase
3. Review performance metrics
4. Fix issues in development
5. Re-deploy with fixes

### 10. Maintenance

**Weekly**
- Review error reports
- Check performance metrics
- Monitor subscription health
- Review Dreamer proposal quality

**Monthly**
- Update dependencies
- Review and optimize database queries
- Analyze user behavior patterns
- Optimize bundle size

## Charter Compliance Verification

Before going live, verify:
- ✅ Stripe USD payments only (no crypto)
- ✅ SagePoints are closed-loop utility credits
- ✅ Affiliate disclosures on all affiliate links
- ✅ POD merch uses external fulfillment
- ✅ Digital marketplace limited to digital goods
- ✅ No trading, speculation, or investment features
- ✅ Transparent pricing throughout
- ✅ Privacy policy and terms of service present

## Support

For deployment issues:
1. Check `/api/analytics/errors` for error logs
2. Review Vercel deployment logs
3. Check Supabase logs for database issues
4. Contact support if needed
