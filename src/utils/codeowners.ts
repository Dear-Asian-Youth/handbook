import { readFileSync } from 'fs';
import { join } from 'path';

interface CodeOwner {
  pattern: string;
  owners: string[];
  isGlob: boolean;
}

/**
 * Parses the CODEOWNERS file and returns an array of ownership rules
 */
function parseCodeOwners(): CodeOwner[] {
  try {
    const codeownersPath = join(process.cwd(), '.github', 'CODEOWNERS');
    const content = readFileSync(codeownersPath, 'utf-8');
    
    const owners: CodeOwner[] = [];
    
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      
      // Split by whitespace
      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) {
        continue;
      }
      
      const [pattern, ...ownersList] = parts;
      
      // Remove @ prefix from usernames
      const cleanOwners = ownersList
        .filter(owner => owner.startsWith('@'))
        .map(owner => owner.substring(1));
      
      if (cleanOwners.length > 0) {
        owners.push({
          pattern,
          owners: cleanOwners,
          isGlob: pattern.includes('*'),
        });
      }
    }
    
    return owners;
  } catch (error) {
    console.warn('Could not read CODEOWNERS file:', error);
    return [];
  }
}

/**
 * Matches a file path against a CODEOWNERS pattern
 */
function matchesPattern(filePath: string, pattern: string): boolean {
  // Normalize paths
  const normalizedPath = filePath.startsWith('/') ? filePath : '/' + filePath;
  
  // Exact match
  if (pattern === normalizedPath) {
    return true;
  }
  
  // Wildcard match (*)
  if (pattern === '*') {
    return true;
  }
  
  // Directory match - if pattern ends with /, match any file in that directory
  if (pattern.endsWith('/')) {
    return normalizedPath.startsWith(pattern);
  }
  
  // Simple glob match for patterns like /path/*
  if (pattern.includes('*')) {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    const regex = new RegExp('^' + regexPattern + '$');
    return regex.test(normalizedPath);
  }
  
  return false;
}

/**
 * Gets the owners for a specific file path
 * Returns the most specific match (longest pattern match)
 */
export function getOwnersForFile(filePath: string): string[] {
  const owners = parseCodeOwners();
  
  // Find all matching patterns
  const matches = owners.filter(owner => 
    matchesPattern(filePath, owner.pattern)
  );
  
  if (matches.length === 0) {
    return [];
  }
  
  // Sort by pattern specificity (longer patterns are more specific)
  // Patterns without wildcards take precedence
  matches.sort((a, b) => {
    if (a.isGlob !== b.isGlob) {
      return a.isGlob ? 1 : -1;
    }
    return b.pattern.length - a.pattern.length;
  });
  
  // Return the most specific match
  return matches[0].owners;
}

/**
 * Gets all unique owners across all files
 */
export function getAllOwners(): string[] {
  const owners = parseCodeOwners();
  const allOwners = new Set<string>();
  
  for (const owner of owners) {
    owner.owners.forEach(o => allOwners.add(o));
  }
  
  return Array.from(allOwners);
}

