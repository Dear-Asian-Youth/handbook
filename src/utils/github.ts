import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Resolves the actual file path for a content entry
 * Handles both index files and regular files, checking for .mdx and .md extensions
 */
export function resolveContentFilePath(entryId: string): string {
  const baseContentPath = 'src/content/docs';
  
  // Possible file paths to check
  const possiblePaths = [
    // Direct file with .mdx
    `${baseContentPath}/${entryId}.mdx`,
    // Direct file with .md
    `${baseContentPath}/${entryId}.md`,
    // Index file with .mdx
    `${baseContentPath}/${entryId}/index.mdx`,
    // Index file with .md
    `${baseContentPath}/${entryId}/index.md`,
  ];
  
  // Check which file actually exists
  for (const path of possiblePaths) {
    const fullPath = join(process.cwd(), path);
    if (existsSync(fullPath)) {
      return path;
    }
  }
  
  // Default fallback: assume it's an .mdx file
  // This handles cases where file system isn't accessible (like in production)
  // Try to determine from the entryId structure
  if (entryId.includes('/')) {
    // Has a slash, likely a file in a subdirectory
    return `${baseContentPath}/${entryId}.mdx`;
  } else {
    // No slash, likely an index file
    return `${baseContentPath}/${entryId}/index.mdx`;
  }
}

/**
 * Constructs GitHub URLs for editing and viewing a file
 */
export function getGitHubUrls(entryId: string, repoOwner: string, repoName: string, branch: string = 'main') {
  const filePath = resolveContentFilePath(entryId);
  const baseUrl = `https://github.com/${repoOwner}/${repoName}`;
  
  return {
    edit: `${baseUrl}/edit/${branch}/${filePath}`,
    view: `${baseUrl}/blob/${branch}/${filePath}`,
    filePath,
  };
}

