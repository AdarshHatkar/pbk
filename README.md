# Primexop Backend Kit

A utility package for managing backend projects.

## Installation

```bash
npm install pbk
```

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

### VSCode Auto-completion and Validation

This package includes JSON schema validation for your configuration file. To enable auto-completion and validation in VSCode:

1. Install the "JSON Language Support" extension in VSCode if you haven't already
2. Add this to your VSCode settings.json (File > Preferences > Settings > Open Settings (JSON)):

```json
{
  "json.schemas": [
    {
      "fileMatch": ["pbk.config.json"],
      "url": "./node_modules/pbk/pbk.schema.json"
    }
  ]
}
```

Now when you edit your `pbk.config.json` file, you'll get:
- Auto-completion for all available options
- Validation to ensure your configuration is correct
- Hover documentation for each field
- Error highlighting for invalid configurations

### Using pbkInit

The `pbkInit`