import { TPbkConfig } from './dist/types.js';

/**
 * Primexop Backend Kit Configuration
 * 
 * This file exports an array of projects and their sections.
 * Each project can have multiple sections, which define repositories
 * and their local paths.
 */
export const pbkConfig: TPbkConfig = {
    projects:[
        {
          projectName: "Example Project",
          projectBaseDirPath: "C:/projects/example",
          sharedBackendPath: "C:/projects/example/shared-backend",
          sections: [
            {
              sectionName: "API",
              repository: {
                name: "example-api",
                path: "https://github.com/organization/example-api"
              },
              localPath: "C:/projects/example/api",
              isZodCreator: true
            },
            {
              sectionName: "Frontend",
              repository: {
                name: "example-frontend",
                path: "https://github.com/organization/example-frontend"
              },
              localPath: "C:/projects/example/frontend",
              isZodCreator: false,
              needNextJsPatch: true
            }
          ]
        },
        {
          projectName: "Another Project",
          projectBaseDirPath: "C:/projects/another",
          sections: [
            {
              sectionName: "Backend",
              repository: {
                name: "another-backend",
                path: "https://github.com/organization/another-backend"
              },
              localPath: "C:/projects/another/backend",
              isZodCreator: true
            }
          ]
        }
      ]
};

