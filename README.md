# Primexop Backend Kit

A utility package for managing backend projects.

## Installation

```bash
npm install pbk
```

## Usage

### Configuration

Create a `pbk.config.ts` file in your project root:

```typescript
import { TPbkConfig } from 'pbk';

const config: TPbkConfig = [
  {
    projectName: "My Project",
    projectBaseDirPath: "/path/to/project",
    sharedBackendPath: "/path/to/shared-backend", // optional
    sections: [
      {
        sectionName: "API",
        repository: {
          name: "my-api",
          path: "https://github.com/organization/my-api"
        },
        localPath: "/path/to/api",
        isZodCreator: true
      },
      // Add more sections as needed
    ]
  }
];

export default config;
```

### Using pbkInit

The `pbkInit` function checks for and loads your configuration file:

```typescript
import { pbkInit } from 'pbk';

async function main() {
  const config = await pbkInit();
  
  if (config) {
    // Configuration file found and loaded successfully
    console.log(`Loaded ${config.length} projects`);
    
    // Work with your configuration
    for (const project of config) {
      console.log(`Project: ${project.projectName}`);
      for (const section of project.sections) {
        console.log(`- Section: ${section.sectionName}`);
      }
    }
  } else {
    // No configuration file found or error loading it
    console.error('Failed to load configuration');
  }
}

main();
```

## Working with tsc-watch

When using `tsc-watch` in your project, the TypeScript files are automatically compiled to JavaScript. 
The `pbkInit` function is designed to handle this scenario - it will check for both:

- `pbk.config.ts` (your source TypeScript config)
- `pbk.config.js` (the compiled JavaScript version)

It will prioritize loading the JavaScript version if available, as this is what Node.js can directly execute.

## Types

The package provides TypeScript types for your configuration:

```typescript
// TPbkProjectSection represents a section within a project
type TPbkProjectSection = {
    sectionName: string;
    repository: {
        name: string;
        path: string;
    };
    localPath: string;
    isZodCreator: boolean;
    needNextJsPatch?: boolean;
};

// TPbkProject represents a project in the configuration
type TPbkProject = {
    projectName: string;
    projectBaseDirPath: string;
    sharedBackendPath?: string;
    sections: TPbkProjectSection[];
};

// TPbkConfig is the type of the config file's default export
type TPbkConfig = TPbkProject[];
```