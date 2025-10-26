# Testing Decap CMS OAuth Flow

## Prerequisites

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Ensure you have a GitHub OAuth App configured with:
   - **Homepage URL:** Your testing URL (e.g., `http://localhost:3000` or production URL)
   - **Authorization callback URL:** `http://localhost:3000/api/callback` (for local) or production callback URL

## Local Testing with Vercel CLI

### Step 1: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` and add your actual values:
```bash
OAUTH_CLIENT_ID=your_actual_github_oauth_client_id
OAUTH_CLIENT_SECRET=your_actual_github_oauth_client_secret
BASE_URL=http://localhost:3000
```

### Step 2: Install Dependencies

```bash
pnpm install
```

Verify that `simple-oauth2` and `randomstring` are installed:
```bash
pnpm list simple-oauth2 randomstring
```

### Step 3: Run Vercel Dev Server

**Important:** Use `vercel dev`, NOT `pnpm dev` or `astro dev`

```bash
vercel dev
```

The Vercel CLI will:
- Build your Astro site
- Run serverless functions locally
- Serve everything at `http://localhost:3000`

### Step 4: Test the OAuth Flow

1. Navigate to: `http://localhost:3000/admin`

2. You should see the Decap CMS login screen

3. Click "Login with GitHub"

4. The auth flow should:
   - Redirect you to `/api/auth` (serverless function)
   - Generate authorization URL with state parameter
   - Redirect to GitHub OAuth authorization page
   - After you approve, redirect back to `/api/callback`
   - Exchange code for access token
   - Pass token back to Decap CMS
   - Log you into the CMS

5. If successful, you'll see the CMS dashboard with your content collections

### Step 5: Verify Functionality

Once logged in, try to:
- View existing content
- Edit a page
- Create a new page
- Preview changes

## Testing in Production (Vercel)

### Step 1: Verify Environment Variables

In Vercel dashboard:
1. Go to your project > Settings > Environment Variables
2. Verify these are set for **Production**:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
   - `BASE_URL` (should be `https://handbook.dearasianyouth.org`)

### Step 2: Deploy Changes

```bash
git add .
git commit -m "Fix Decap CMS authentication issues"
git push origin main
```

Vercel will automatically deploy the changes.

### Step 3: Test Production

1. Visit: `https://handbook.dearasianyouth.org/admin`
2. Click "Login with GitHub"
3. Complete OAuth flow
4. Verify CMS functionality

## Troubleshooting

### Error: "Cannot find module 'simple-oauth2'"

**Solution:** The dependencies weren't installed. Run:
```bash
pnpm install
```

Then redeploy to Vercel (for production) or restart `vercel dev` (for local).

### Error: "OAuth client ID not configured"

**Solution:** Environment variables are missing.

**Local:** Check `.env` file exists and has correct values
**Production:** Check Vercel environment variables in dashboard

### Error: "Missing authorization code"

**Solution:** The OAuth flow was interrupted. This could be due to:
- Incorrect callback URL in GitHub OAuth App settings
- BASE_URL environment variable not matching actual URL
- Browser blocking third-party cookies

**Fix:**
1. Verify GitHub OAuth App callback URL matches: `{BASE_URL}/api/callback`
2. Ensure BASE_URL doesn't have trailing slash
3. Try in incognito/private browsing mode

### Error: 500 Internal Server Error

**Solution:** Check Vercel function logs for detailed error:

**Production:**
1. Go to Vercel dashboard
2. Navigate to your project > Deployments
3. Click on the latest deployment
4. Click "Functions" tab
5. Find `/api/auth` or `/api/callback`
6. Click to view logs

**Local:**
Check the terminal where you ran `vercel dev` - errors will be printed there.

### OAuth Flow Starts But Never Completes

**Possible causes:**
1. **Browser blocks popup:** Decap CMS uses popups for OAuth
   - Allow popups for your domain
   - Check browser console for errors

2. **CORS issues:** 
   - Check browser console for CORS errors
   - Verify `vercel.json` has proper CORS headers

3. **State parameter mismatch:**
   - This is logged in the console
   - Check function logs for "OAuth callback received with state"

## Verifying the Fix

Compare before and after:

### Before (Broken):
- 500 FUNCTION_INVOCATION_FAILED error
- No detailed error messages
- Functions crashed immediately

### After (Fixed):
- Clear error messages if configuration is wrong
- OAuth flow completes successfully
- Users can log in and edit content
- Function logs show detailed information

## Next Steps After Successful Testing

1. ✅ Document the working OAuth flow
2. ✅ Add monitoring for function errors
3. ✅ Consider implementing proper state validation with a database
4. ✅ Set up alerts for authentication failures
5. ✅ Train content editors on using Decap CMS

## Questions?

If issues persist:
1. Check function logs in Vercel dashboard
2. Review `DECAP_CMS_FIXES.md` for implementation details
3. Verify all environment variables are correctly set
4. Ensure GitHub OAuth App settings match your configuration

