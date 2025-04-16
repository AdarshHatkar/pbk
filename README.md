# Primexop Backend Kit (PBK)

A utility package for managing backend projects with TypeScript support. This kit provides tools for project initialization, configuration management, and cross-project import validation.

## Features

- Project configuration management
- B2F Portal integration support
- Cross-project import validation
- VSCode integration with JSON schema validation
- TypeScript support
- CLI tools for project management

## Installation

```bash
npm install @primexop/pbk --save-dev
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.8.3

## Usage

### Configuration

Create a `pbk.config.json` file in your project root:

```json
{
  "projects": [
    {
      "projectName": "My Project",
      "projectBaseDirPath": "/path/to/project",
      "sharedBackendPath": "/path/to/shared-backend",
      "sections": [
        {
          "sectionName": "API",
          "repository": {
            "name": "my-api",
            "path": "https://github.com/organization/my-api"
          },
          "localPath": "/path/to/api",
          "isZodCreator": true
        }
      ]
    }
  ],
  "b2fPortal": false,
  "checkCrossProjectImports": true
}
```

### VSCode Integration

This package includes JSON schema validation for your configuration file. To enable auto-completion and validation in VSCode:

1. Install the "JSON Language Support" extension in VSCode
2. Add this to your VSCode settings.json:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["pbk.config.json"],
      "url": "./node_modules/pbk/pbk.schema.json"
    }
  ],
  "files.associations": {
    "pbk.config.json": "jsonc"
  }
}
```

The `"files.associations"` setting enables support for comments in your JSON configuration file. This allows you to add helpful comments to document your configuration:

```json
{
  "projects": [
    {
      // Main project configuration
      "projectName": "My Project",
      "projectBaseDirPath": "/path/to/project",
      "sharedBackendPath": "/path/to/shared-backend",
      "sections": [
        {
          // API section configuration
          "sectionName": "API",
          "repository": {
            "name": "my-api",
            "path": "https://github.com/organization/my-api"
          },
          "localPath": "/path/to/api",
          "isZodCreator": true
        }
      ]
    }
  ],
  // Feature flags
  "b2fPortal": false,
  "checkCrossProjectImports": true
}
```

Benefits:
- Auto-completion for all available options
- Validation to ensure your configuration is correct
- Hover documentation for each field
- Error highlighting for invalid configurations

### API Usage

```typescript
import { pbkInit } from '@primexop/pbk';

// Initialize with default config path (pbk.config.json in current directory)
const config = pbkInit();

// Or specify a custom config path
const config = pbkInit({ configPath: './custom/path/config.json' });
```

### Features

#### B2F Portal Integration
When `b2fPortal` is set to `true` in the configuration, the kit will initialize B2F Portal specific features.

#### Cross-Project Import Validation
When `checkCrossProjectImports` is enabled, the kit will validate imports between different projects to ensure proper dependency management.

## Development

### Available Scripts

- `npm run dev` - Start development mode with watch
- `npm run build` - Build the project
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run TypeScript type checking

### Project Structure

```
src/
├── bin/           # CLI entry points
├── cli/           # CLI command implementations
├── configs/       # Configuration related code
├── helpers/       # Helper functions
├── utils/         # Utility functions
├── b2fPortalV3/   # B2F Portal specific implementations
└── types.ts       # TypeScript type definitions
```

## License

ISC