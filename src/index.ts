/**
 * Main entry point for the package
 */

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// When using ES modules with TypeScript, you need to include the .js extension
// in import statements, even though the source file has a .ts extension
// This is because Node.js will look for .js files at runtime
export * from './utils.js';