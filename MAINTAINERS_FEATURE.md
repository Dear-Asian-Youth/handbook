# Maintainers Sidebar Feature

## Overview

This feature adds a maintainers section to the right sidebar of each documentation page, showing GitHub profile photos of page maintainers and providing quick links to edit or view the source file on GitHub.

## Implementation Details

### Files Created

1. **`.github/CODEOWNERS`**
   - GitHub's standard CODEOWNERS file format
   - Defines ownership patterns for directories and files
   - Supports both wildcards (`*`) and specific path patterns
   - Example patterns included for all major handbook sections

2. **`src/utils/codeowners.ts`**
   - TypeScript utility for parsing and matching CODEOWNERS patterns
   - `parseCodeOwners()`: Reads and caches the CODEOWNERS file
   - `getOwnersForFile(filePath)`: Returns maintainers for a specific file
   - `matchesPattern()`: Matches file paths against glob patterns
   - Handles both directory-level (`/path/`) and file-level patterns
   - Returns most specific match when multiple patterns apply

3. **`src/components/PageMaintainers.astro`**
   - Displays maintainers section with GitHub profile photos
   - Shows all maintainers when multiple are assigned
   - Profile photos fetched from `https://github.com/{username}.png`
   - Includes two action buttons:
     - **Edit this page**: Links to GitHub editor
     - **View source**: Links to view file on GitHub
   - Fully styled with light/dark mode support
   - Responsive design

4. **`src/components/PageSidebar.astro`**
   - Overrides Starlight's default PageSidebar component
   - Wraps the default component and injects PageMaintainers
   - Extracts file path from page entry data
   - Passes file path to maintainers component

### Files Modified

1. **`astro.config.mjs`**
   - Added `components` configuration to override PageSidebar
   - Points to custom PageSidebar component

2. **`src/styles/custom.css`**
   - Added global styles for maintainers section
   - Light and dark mode color adjustments
   - Improved button contrast for accessibility

## Usage

### Assigning Maintainers

Edit `.github/CODEOWNERS` to assign maintainers:

```
# Default owner for all files
* @username

# Directory-level ownership
/src/content/docs/engineering/ @engineer1 @engineer2

# File-specific ownership
/src/content/docs/operations/index.mdx @operations-lead
```

### Pattern Matching Rules

1. **Exact match**: `/src/content/docs/engineering/index.mdx`
2. **Wildcard**: `*` (matches all files)
3. **Directory**: `/src/content/docs/engineering/` (matches all files in directory)
4. **Glob pattern**: `/src/content/docs/*/index.mdx`

When multiple patterns match, the most specific pattern (longest, non-wildcard) takes precedence.

### GitHub URLs

The feature automatically generates correct GitHub URLs:

- **Edit URL**: `https://github.com/dearasianyouth/handbook/edit/main/{filepath}`
- **View URL**: `https://github.com/dearasianyouth/handbook/blob/main/{filepath}`

## Features

✅ Shows GitHub profile photos for all maintainers
✅ Supports multiple maintainers per page
✅ "Edit this page" button with GitHub editor link
✅ "View source" button to see file on GitHub
✅ Fully responsive design
✅ Light and dark mode support
✅ Caches CODEOWNERS parsing for performance
✅ Handles directory and file-level ownership patterns
✅ Most specific pattern matching

## Testing

The feature was successfully built and tested:
- Build completes without errors
- No TypeScript or linting issues
- Dev server runs successfully
- All 18 pages rendered correctly

## Future Enhancements

Possible improvements for the future:
- Add last updated date/time
- Show contributor count
- Add "Report issue" button
- Display maintenance status badges
- Link to page edit history

