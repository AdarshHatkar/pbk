import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Utility functions for working with paths in the backend kit
 */

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate common paths
export const rootDirPath = join(__dirname, '..', '..'); // Up two levels from src/utils to project root
export const srcDirPath = join(rootDirPath, 'src');
export const distDirPath = join(rootDirPath, 'dist');

/**
 * Resolves a path relative to the project root
 * @param relativePath - Path relative to the project root
 * @returns Absolute path
 */
export function resolveFromRoot(relativePath: string): string {
  return join(rootDirPath, relativePath);
}

/**
 * Resolves a path relative to the src directory
 * @param relativePath - Path relative to the src directory
 * @returns Absolute path
 */
export function resolveFromSrc(relativePath: string): string {
  return join(srcDirPath, relativePath);
}

/**
 * Resolves a path relative to the dist directory
 * @param relativePath - Path relative to the dist directory
 * @returns Absolute path
 */
export function resolveFromDist(relativePath: string): string {
  return join(distDirPath, relativePath);
}