# Shared TypeScript Configurations

This package provides shared TypeScript configurations for the monorepo.

## Available Configs

- `base.json` - Base configuration for all packages
- `react.json` - React specific configuration
- `nextjs.json` - Next.js specific configuration
- `vue.json` - Vue specific configuration
- `svelte.json` - Svelte specific configuration

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "@my-fe/config-typescript/react.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```
