# PrimeXOP Backend Kit - Development Plan

## Overview

PrimeXOP Backend Kit is a comprehensive backend development toolkit that provides powerful features for project management, file synchronization, Git operations, and code generation. It's designed to streamline the development workflow between backend and frontend projects, as well as between different backend services.

## Package Structure

```
primexop-backend-kit/
├── src/
│   ├── core/
│   │   ├── types.ts           # Core type definitions
│   │   ├── config.ts          # Configuration handling
│   │   └── constants.ts       # Constants and enums
│   ├── modules/
│   │   ├── sync/             # File synchronization
│   │   │   ├── fileSync.ts
│   │   │   ├── projectSync.ts
│   │   │   ├── sectionSync.ts
│   │   │   └── syncStrategies.ts
│   │   ├── git/              # Git operations
│   │   │   ├── gitPush.ts
│   │   │   ├── gitSync.ts
│   │   │   ├── gitAcp.ts
│   │   │   └── gitDeploy.ts
│   │   ├── zod/              # Zod operations
│   │   │   ├── zodCreator.ts
│   │   │   ├── zodValidator.ts
│   │   │   └── zodSync.ts
│   │   └── project/          # Project management
│   │       ├── moduleCreator.ts
│   │       ├── projectManager.ts
│   │       └── moduleValidator.ts
│   ├── utils/
│   │   ├── pathUtils.ts
│   │   ├── validationUtils.ts
│   │   ├── fileUtils.ts
│   │   └── gitUtils.ts
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── sync.ts
│   │   │   ├── git.ts
│   │   │   ├── project.ts
│   │   │   └── zod.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Core Features

### 1. Project Configuration

- Type-safe configuration using Zod
- Project and section management
- Environment-specific settings
- Validation and error handling
- Support for multiple project types (admin, website, webApp, rnApp)
- Shared backend configuration
- Repository path management
- Next.js compatibility settings

### 2. File Synchronization

- Backend-to-Frontend sync
- Backend-to-Backend sync
- File pattern matching
- Conflict resolution
- Change detection
- Directory structure validation
- File extension handling (.ts, .d.ts)
- Import/export statement management
- Next.js patch support
- Module file synchronization
- Section-specific synchronization

### 3. Git Operations

- Multi-repository management
- Batch git operations
- Branch management
- Conflict handling
- Status checking
- Automatic commit messages
- Pull before push
- Branch validation
- Repository validation
- Git status checking
- Repository path validation
- Package.json validation

### 4. Zod Schema Management

- Automatic Zod schema creation
- Schema validation
- Type generation
- Schema synchronization
- Module record validation
- Zod schema record validation
- Schema file pattern matching
- Type declaration file management

### 5. Project Management

- Module creation
- Project structure management
- Dependency management
- Configuration validation
- Project import validation
- Directory structure validation
- File existence validation
- Repository validation
- Package.json validation

## Implementation Phases

### Phase 1: Core Setup

1. Initialize package structure
2. Set up build system
3. Implement core types
4. Create configuration system
5. Set up CLI framework
6. Implement path utilities
7. Set up validation system
8. Create error handling
9. Implement logging system
10. Set up testing framework

### Phase 2: File Synchronization

1. Implement file sync core
2. Add pattern matching
3. Create sync strategies
4. Implement conflict resolution
5. Add change detection
6. Implement directory sync
7. Add file extension handling
8. Create import/export management
9. Implement Next.js patch
10. Add section sync

### Phase 3: Git Operations

1. Implement git core
2. Add multi-repo support
3. Create batch operations
4. Implement conflict handling
5. Add status checking
6. Implement branch validation
7. Add repository validation
8. Create package.json validation
9. Implement automatic commits
10. Add pull before push

### Phase 4: Zod Integration

1. Implement Zod creator
2. Add schema validation
3. Create type generation
4. Implement schema sync
5. Add validation utilities
6. Implement module validation
7. Add schema record validation
8. Create type declaration management
9. Implement file pattern matching
10. Add schema synchronization

### Phase 5: Project Management

1. Implement module creator
2. Add project structure management
3. Create dependency management
4. Implement configuration validation
5. Add project templates
6. Implement import validation
7. Add directory validation
8. Create file validation
9. Implement repository validation
10. Add package.json validation

## Configuration Example

```typescript
// primexop.config.ts
import { PrimeXOPConfig } from "primexop-backend-kit";

const config: PrimeXOPConfig = {
    projects: [
        {
            projectName: "my-project",
            projectBaseDirPath: "src",
            sharedBackendPath: "../../shared_one/backend",
            sections: [
                {
                    sectionName: "adminPanel",
                    repository: {
                        name: "my-project-admin",
                        path: "../../admin",
                    },
                    localPath: "admin",
                    isZodCreator: true,
                    needNextJsPatch: false,
                },
                {
                    sectionName: "website",
                    repository: {
                        name: "my-project-website",
                        path: "../../website",
                    },
                    localPath: "website",
                    isZodCreator: true,
                    needNextJsPatch: true,
                },
                {
                    sectionName: "webApp",
                    repository: {
                        name: "my-project-webapp",
                        path: "../../webapp",
                    },
                    localPath: "webapp",
                    isZodCreator: true,
                    needNextJsPatch: false,
                },
                {
                    sectionName: "rnApp",
                    repository: {
                        name: "my-project-rnapp",
                        path: "../../rnapp",
                    },
                    localPath: "rnapp",
                    isZodCreator: true,
                    needNextJsPatch: true,
                },
            ],
        },
    ],
    options: {
        autoSync: true,
        gitOperations: true,
        nextJsPatch: true,
        validateImports: true,
        checkModuleRecords: true,
        checkZodRecords: true,
    },
};

export default config;
```

## CLI Commands

```bash
# Initialize a new project
primexop init

# Sync project files
primexop sync

# Sync specific project
primexop sync --project my-project

# Sync specific section
primexop sync --project my-project --section adminPanel

# Git operations
primexop git push-all

# Git operations for specific project
primexop git push-all --project my-project

# Git operations for specific section
primexop git push-all --project my-project --section adminPanel

# Create Zod schemas
primexop zod create

# Create Zod schemas for specific project
primexop zod create --project my-project

# Create Zod schemas for specific section
primexop zod create --project my-project --section adminPanel

# Project management
primexop project create-module

# Validate project imports
primexop project validate-imports

# Delete all repositories
primexop git delete-all

# Transfer to shared
primexop git transfer-shared
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write comprehensive tests
- Document all public APIs
- Use async/await for asynchronous operations
- Implement proper error handling
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the single responsibility principle

### Testing Strategy

- Unit tests for core functionality
- Integration tests for file operations
- E2E tests for CLI commands
- Test coverage reporting
- Mock file system operations
- Mock git operations
- Test error handling
- Test edge cases
- Test configuration validation
- Test file synchronization

### Documentation

- API documentation
- CLI command documentation
- Configuration guide
- Migration guide
- Examples and use cases
- Type definitions
- Error codes and messages
- Troubleshooting guide
- Best practices
- Architecture overview

### Release Process

1. Version bump
2. Changelog update
3. Build verification
4. Test execution
5. Documentation update
6. Package publishing
7. Release notes
8. GitHub release
9. npm publish
10. Announcement

## Dependencies

```json
{
    "dependencies": {
        "zod": "^3.x",
        "commander": "^9.x",
        "simple-git": "^3.x",
        "fs-extra": "^10.x",
        "glob": "^8.x",
        "chalk": "^4.x",
        "ora": "^5.x",
        "inquirer": "^8.x",
        "dotenv": "^16.x"
    },
    "devDependencies": {
        "typescript": "^4.x",
        "@types/node": "^16.x",
        "@types/fs-extra": "^9.x",
        "@types/glob": "^7.x",
        "@types/inquirer": "^8.x",
        "jest": "^27.x",
        "ts-jest": "^27.x",
        "eslint": "^8.x",
        "prettier": "^2.x",
        "husky": "^7.x",
        "lint-staged": "^12.x"
    }
}
```

## Type Definitions

### Core Types

```typescript
// Project Section
export type TB2fPortalSection = {
    sectionName: string;
    repository: {
        name: string;
        path: string;
    };
    localPath: string;
    isZodCreator: boolean;
    needNextJsPatch?: boolean;
};

// Project
export type TB2fPortalProject = {
    projectName: string;
    projectBaseDirPath: string;
    sharedBackendPath?: string;
    sections: TB2fPortalSection[];
};

// Configuration
export type TB2fPortalConfig = {
    projects: TB2fPortalProject[];
    options?: {
        autoSync?: boolean;
        gitOperations?: boolean;
        nextJsPatch?: boolean;
        validateImports?: boolean;
        checkModuleRecords?: boolean;
        checkZodRecords?: boolean;
    };
};

// Sync Options
export type TSyncFilesAndFoldersParams = {
    sourceDirPath: string;
    targetDirPath: string;
    fileNamePatterns?: string[];
    deleteExtraFilesInTarget?: boolean;
};
```

## Future Enhancements

1. Frontend kit integration
2. Cloud deployment support
3. Plugin system
4. Custom template support
5. Advanced conflict resolution
6. Performance optimizations
7. Monitoring and logging
8. CI/CD integration
9. Database schema synchronization
10. API documentation generation
11. Docker integration
12. Kubernetes deployment
13. Multi-environment support
14. Custom validation rules
15. Automated testing integration

## Contributing Guidelines

1. Fork the repository
2. Create feature branch
3. Follow code style
4. Write tests
5. Update documentation
6. Submit pull request
7. Add changelog entry
8. Update version
9. Run all tests
10. Check linting

## License

MIT License
