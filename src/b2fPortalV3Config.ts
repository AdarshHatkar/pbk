/**
 * B2F Portal project configuration
 * This file provides project configuration for the CLI tools
 */

import { loadConfig } from './utils/loadConfig.js';
import { TPbkProject } from './types.js';

// Load projects from the configuration file
const config = loadConfig();

// Export projects for use in CLI tools
export const b2fPortalProjects: TPbkProject[] = config.projects;