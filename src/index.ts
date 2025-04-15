/**
 * Main entry point for the package
 */

import * as fs from 'fs';
import * as path from 'path';
import { TPbkConfig, TPbkProject } from './types.js';

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * Initializes the primexop-backend-kit by checking for a pbk.config.ts file
 * in the repository root and loading the configuration.
 * 
 * @returns {Promise<TPbkConfig | null>} The loaded configuration or null if not found
 */

type TPbkInit ={
  projects:TPbkProject[]
}
export async function pbkInit({projects}:TPbkInit): Promise<TPbkProject[] | null> {
 
  try {
   
    if (!Array.isArray(projects)) {
      console.error('Config file does not export a default array of projects');
      return null;
    }
    
    // Validate the configuration structure
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      if (!project.projectName || !project.projectBaseDirPath || !Array.isArray(project.sections)) {
        console.error(`Invalid project configuration at index ${i}: missing required fields`);
        return null;
      }
      
      for (let j = 0; j < project.sections.length; j++) {
        const section = project.sections[j];
        if (!section.sectionName || !section.repository || !section.localPath || typeof section.isZodCreator !== 'boolean') {
          console.error(`Invalid section configuration in project "${project.projectName}" at index ${j}: missing required fields`);
          return null;
        }
      }
    }
    
    console.log(`Loaded configuration with ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error(`Error loading config file:`, error);
    return null;
  }
}

// When using ES modules with TypeScript, you need to include the .js extension
// in import statements, even though the source file has a .ts extension
// This is because Node.js will look for .js files at runtime
export * from './utils.js';
export * from './types.js';