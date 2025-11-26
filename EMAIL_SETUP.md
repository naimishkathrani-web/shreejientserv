# Email Setup Instructions

## Quick Setup (5 minutes)

1. **Get Resend API Key:**
   - Go to https://resend.com/signup
   - Sign up (free tier: 100 emails/day)
   - Get your API key from dashboard

2. **Add to Environment:**
   Create `.env.local` in project root:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

3. **Test:** Submit a contract form

## Email Flow
- Existing Rider: 1 email (contract terms)
- New Rider: 2 emails (contract + activation timeline)
- All emails CC: hr@shreejientserv.in
