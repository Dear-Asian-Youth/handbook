# Dear Asian Youth Handbook

The living documentation for Dear Asian Youth—a single source of truth that grows and evolves with our organization. Built with the philosophy that documentation should be accessible, comprehensive, and always up-to-date.

Built with [Starlight](https://starlight.astro.build) and [Astro](https://astro.build).

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 📚 Project Structure

```
.
├── public/           # Static assets (favicons, etc.)
├── src/
│   ├── assets/       # Images and other assets
│   ├── content/
│   │   └── docs/     # Documentation pages (MDX/Markdown)
│   └── content.config.ts
└── astro.config.mjs  # Astro configuration
```

## 📝 Adding Content

### Option 1: Using Decap CMS (Recommended for Non-Technical Users)

The handbook includes Decap CMS for a user-friendly editing experience. Navigate to `/admin` on the deployed site to access the content management interface.

**First-Time Setup (Admin Only):**

1. Create a GitHub OAuth App:
   - Go to GitHub Settings > Developer settings > OAuth Apps > New OAuth App
   - Set **Application name**: `DAY Handbook CMS`
   - Set **Homepage URL**: `https://handbook.dearasianyouth.org`
   - Set **Authorization callback URL**: `https://handbook.dearasianyouth.org/api/callback`
   - Click "Register application"
   - Copy the **Client ID** and generate a **Client Secret**

2. Configure Vercel Environment Variables:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `OAUTH_CLIENT_ID`: Your GitHub OAuth App Client ID
     - `OAUTH_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
     - `BASE_URL`: `https://handbook.dearasianyouth.org` (for custom domain support)
   - Redeploy the site for changes to take effect

**Using the CMS:**
- Navigate to `https://handbook.dearasianyouth.org/admin`
- Click "Login with GitHub"
- Edit content using the visual editor
- Changes are committed directly to the GitHub repository

### Option 2: Direct File Editing

Add `.md` or `.mdx` files to `src/content/docs/` to create new pages. The file structure matches the URL structure.

## 🔗 Learn More

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
