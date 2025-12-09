# @my-fe/utils

Pure TypeScript utility functions shared across all apps.

## Usage

```typescript
import { formatDate, debounce, sleep, capitalize, isDefined } from '@my-fe/utils';

// Format dates
const formatted = formatDate(new Date()); // "December 9, 2025"

// Debounce functions
const debouncedSearch = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

// Async sleep
await sleep(1000);

// String utilities
const title = capitalize('hello'); // "Hello"

// Type guards
if (isDefined(value)) {
  // TypeScript knows value is not null/undefined
}
```

## Features

- 100% TypeScript
- Tree-shakeable exports
- Zero dependencies
- Source code shared (no build step required)
