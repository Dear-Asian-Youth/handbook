# Decap CMS Authentication Fixes

## Issues Fixed

### 1. Missing Dependencies (CRITICAL FIX)
**Problem:** The serverless functions (`api/auth.js` and `api/callback.js`) were importing npm packages that weren't declared in `package.json`. This caused immediate crashes with "Cannot find module" errors.

**Fix:** Added the missing dependencies to `package.json`:
- `simple-oauth2: ^5.1.0` - OAuth2 client library
- `randomstring: ^1.3.1` - Secure random string generator

### 2. Incorrect Decap CMS Package
**Problem:** The project had `decap-cms-app` in `package.json` but the HTML file was loading `decap-cms` from CDN, causing confusion and potential version mismatches.

**Fix:** 
- Removed unused `decap-cms-app` from package.json
- Standardized on CDN version: `decap-cms@^3.3.0`
- This is the correct approach for static sites - no build process needed

### 3. Environment Variable Validation
**Problem:** Functions would crash with cryptic errors if environment variables weren't set in Vercel.

**Fix:** Added validation with clear error messages:
```javascript
if (!process.env.OAUTH_CLIENT_ID) {
  return res.status(500).json({ 
    error: 'Server configuration error',
    message: 'OAuth client ID not configured. Please contact the administrator.'
  });
}
```

### 4. Improved Error Handling
**Problem:** Errors were logged to console but users only saw generic 500 errors.

**Fix:** Added comprehensive try-catch blocks with detailed error logging and user-friendly error messages in both `api/auth.js` and `api/callback.js`.

### 5. OAuth State Parameter Validation
**Problem:** The `state` parameter was generated but never validated, creating a potential CSRF vulnerability.

**Fix:** Added state parameter validation in `api/callback.js` with clear documentation about the limitation of serverless functions (no shared state storage).

**Note:** For production-grade security, consider using a database or signed JWT tokens to validate state parameters between requests.

### 6. CORS Headers for API Functions
**Problem:** API endpoints might fail due to missing CORS headers.

**Fix:** Added proper CORS headers in `vercel.json` for all API routes:
```json
{
  "source": "/api/(.*)",
  "headers": [
    { "key": "Access-Control-Allow-Origin", "value": "*" },
    { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,POST" },
    ...
  ]
}
```

### 7. Environment Variables Documentation
**Problem:** No template file showing what environment variables are needed.

**Fix:** Created `env.example` file with clear documentation of all required variables and setup instructions.

## Deployment Checklist

Before deploying to production, ensure you have:

1. ✅ Set environment variables in Vercel:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
   - `BASE_URL`

2. ✅ Created GitHub OAuth App with correct callback URL

3. ✅ Installed dependencies: `pnpm install`

4. ✅ Verified the OAuth callback URL matches in:
   - GitHub OAuth App settings
   - `BASE_URL` environment variable
   - `public/admin/config.yml` base_url

## Testing Locally

1. Copy `env.example` to `.env` and fill in values
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel dev` (not `pnpm dev` - Astro dev server won't run serverless functions)
4. Navigate to `http://localhost:3000/admin`
5. Test GitHub OAuth login

## Architecture Notes

### Why This Implementation?

Decap CMS is a **Git-based CMS** that:
- Runs entirely in the browser (static app)
- Uses GitHub API to edit files directly in the repository
- Requires OAuth for authentication
- Needs serverless functions to keep OAuth secrets secure

### Starlight Integration

Decap CMS is **not** a Starlight plugin. It's a separate system:
- Admin panel lives at `/admin` (static HTML + JS)
- Uses Vercel serverless functions for OAuth flow
- Edits files in the Git repo via GitHub API
- Changes require rebuild/redeploy to be visible on the site

This is the correct approach for static site generators.

### Security Considerations

1. **OAuth Secrets:** Never commit `OAUTH_CLIENT_SECRET` to git
2. **State Validation:** Current implementation has limitations due to serverless architecture
3. **HTTPS Only:** OAuth flow requires HTTPS in production
4. **Repository Access:** OAuth token grants write access to the repository

## Root Cause of Original Error

The `500: FUNCTION_INVOCATION_FAILED` error was caused by:

1. **Primary Cause:** ES Module vs CommonJS conflict
   - `package.json` has `"type": "module"` which makes all `.js` files ES modules
   - Serverless functions used CommonJS syntax (`require`/`module.exports`)
   - Error: "ReferenceError: require is not defined in ES module scope"
   - **Fix:** Renamed `api/auth.js` → `api/auth.cjs` and `api/callback.js` → `api/callback.cjs`

2. **Secondary Cause:** Missing environment variable validation
   - If env vars missing, functions would crash with no useful error messages
   - Now provides clear error messages instead of cryptic failures

## What Changed

### Files Modified:
- `package.json` - Fixed dependencies
- `api/auth.js` - Added validation and error handling
- `api/callback.js` - Added validation, error handling, and state checking
- `public/admin/index.html` - Fixed CDN version reference
- `vercel.json` - Added CORS headers for API routes
- `README.md` - Updated setup instructions
- `env.example` - Created (new file)

### Files Not Changed:
- `public/admin/config.yml` - Configuration was already correct
- `astro.config.mjs` - No changes needed (Decap CMS is separate from Starlight)

## Next Steps

1. Deploy these changes to Vercel
2. Verify environment variables are set in Vercel dashboard
3. Test the OAuth flow: visit `/admin` and click "Login with GitHub"
4. If errors persist, check Vercel function logs for detailed error messages

