# Primexop Backend Kit (PBK) 🚀

[![npm version](https://badge.fury.io/js/%40primexop%2Fpbk.svg)](https://badge.fury.io/js/%40primexop%2Fpbk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-green.svg)](https://nodejs.org/)

> A powerful TypeScript utility for managing backend projects with features like B2F Portal integration, cross-project validation, and Next.js support.

## 📦 Features

- 🔧 Project configuration management with TypeScript support
- 🌐 B2F Portal integration support
- 🔍 Cross-project import validation
- 💻 VSCode integration with JSON schema validation
- 🛠️ CLI tools for project management
- ⚡ Next.js patch support for specific sections
- 🔄 Shared backend path configuration

## 🚀 Quick Start

### Installation

```bash
npm install @primexop/pbk --save-dev
```

### Basic Usage

```typescript
import { pbkInit } from '@primexop/pbk';

// Initialize with default config path (pbk.config.json in current directory)
const config = pbkInit();

// Or specify a custom config path
const config = pbkInit({ configPath: './custom/path/config.json' });
```

## 📋 Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.8.3

## ⚙️ Configuration

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
          "isZodCreator": true,
          "needNextJsPatch": false
        }
      ]
    }
  ],
  "b2fPortal": false,
  "checkCrossProjectImports": true
}
```

### 📝 Configuration Options

#### Project Configuration
- `projectName`: Name of your project
- `projectBaseDirPath`: Base directory path for the project
- `sharedBackendPath`: (Optional) Path to shared backend code
- `sections`: Array of project sections

#### Section Configuration
- `sectionName`: Name of the section
- `repository`: Repository information
  - `name`: Repository name
  - `path`: Repository URL
- `localPath`: Local path where the section code resides
- `isZodCreator`: Whether the section uses Zod for validation
- `needNextJsPatch`: (Optional) Whether the section needs Next.js patch

#### Global Configuration
- `b2fPortal`: Enable/disable B2F Portal integration
- `checkCrossProjectImports`: Enable/disable cross-project import validation

## 🔧 VSCode Integration

This package includes JSON schema validation for your configuration file. To enable auto-completion and validation in VSCode:

1. Install the "JSON Language Support" extension in VSCode
2. Add this to your VSCode settings.json:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["pbk.config.json"],
      "url": "./node_modules/@primexop/pbk/pbk.schema.json"
    }
  ],
  "files.associations": {
    "pbk.config.json": "jsonc"
  }
}
```

### 💡 Benefits
- ✨ Auto-completion for all available options
- ✅ Validation to ensure your configuration is correct
- 📚 Hover documentation for each field
- ⚠️ Error highlighting for invalid configurations

## 🚀 Features in Detail

### B2F Portal Integration
When `b2fPortal` is set to `true` in the configuration, the kit will initialize B2F Portal specific features.

### Cross-Project Import Validation
When `checkCrossProjectImports` is enabled, the kit will validate imports between different projects to ensure proper dependency management.

### Next.js Patch Support
Sections can be configured with `needNextJsPatch: true` to apply Next.js specific patches.

## 🛠️ CLI Commands

PBK comes with several CLI commands to help you manage your projects:

```bash
# Initialize a pbk.config.json file
npx @primexop/pbk init

# Fix JSON file formatting
npx @primexop/pbk fix-config-file

# Delete b2fPortal directory in all repositories
npx @primexop/pbk delete-all-repos

# Deploy all repositories
npx @primexop/pbk deploy-all-repos

# Add, commit, and push changes in all repositories
npx @primexop/pbk git-acp-all-repos

# Push b2fPortal changes in all repositories
npx @primexop/pbk git-push-all-repos

# Transfer project files to shared backend repositories
npx @primexop/pbk transfer-2-shared

# Create a shell script to initialize workspaces
npx @primexop/pbk create-init-workspace-shell-file

# Update package.json to use local development version
npx @primexop/pbk add-dev-version

# Update package.json to use published production version
npx @primexop/pbk add-prod-version
```

### Development and Production Versioning

PBK provides commands to easily switch between development and production versions:

- `add-dev-version` updates your project to use the local development version from `C:/primexopRepos/pbk`
- `add-prod-version` reverts back to using the published npm version (latest by default)

Examples:
```bash
# Switch to local development version
npx @primexop/pbk add-dev-version

# Switch back to latest published version
npx @primexop/pbk add-prod-version

# Switch to a specific published version
npx @primexop/pbk add-prod-version --version "1.0.7"

# Apply to a different directory
npx @primexop/pbk add-prod-version --dir ../other-project
```

### Workspace Initialization Script

The `create-init-workspace-shell-file` command generates a shell script (`initWorkspace.sh`) that helps you:

- Select your preferred editor (VSCode, Cursor, or Trae)
- Open all your project directories in the selected editor
- Navigate between project sections easily

After generating the script, make it executable:

```bash
chmod +x initWorkspace.sh
```

Then run it:

```bash
./initWorkspace.sh
```

## 👩‍💻 Development

### Available Scripts

- `npm run dev` - Start development mode with watch
- `npm run build` - Build the project
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts
- `npm run release:patch` - Release a patch version

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

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the [GitHub repository](https://github.com/AdarshHatkar/pbk/issues).