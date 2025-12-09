# @my-fe/ui-react

Shared React components library.

## Usage

```tsx
import { Button, Input } from '@my-fe/ui-react';

function MyApp() {
  return (
    <div>
      <Button variant="primary" size="md" onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error="Invalid email"
      />
    </div>
  );
}
```

## Features

- TypeScript support
- Tailwind CSS styles (requires your app to have Tailwind configured)
- Source code shared (no build step)
- Tree-shakeable exports

## Components

- `Button` - Versatile button component with variants and sizes
- `Input` - Form input with label and error support
