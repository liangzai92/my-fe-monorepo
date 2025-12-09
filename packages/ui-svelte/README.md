# @my-fe/ui-svelte

Shared Svelte 5 components library.

## Usage

```svelte
<script lang="ts">
  import { Button, Input } from '@my-fe/ui-svelte';

  let email = $state('');
</script>

<Button variant="primary" size="md" onclick={() => console.log('Clicked!')}>
  Click Me
</Button>

<Input
  bind:value={email}
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
/>
```

## Features

- Svelte 5 Runes API
- TypeScript support
- Tailwind CSS styles (requires your app to have Tailwind configured)
- Source code shared (no build step)

## Components

- `Button` - Button component with variants and sizes
- `Input` - Form input with bind:value, label and error support
