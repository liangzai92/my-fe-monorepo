# @my-fe/ui-vue

Shared Vue 3 components library.

## Usage

```vue
<script setup lang="ts">
import { VButton, VInput } from '@my-fe/ui-vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <div>
    <VButton variant="primary" size="md" @click="handleClick">
      Click Me
    </VButton>

    <VInput
      v-model="email"
      label="Email"
      type="email"
      placeholder="Enter your email"
      error="Invalid email"
    />
  </div>
</template>
```

## Features

- Vue 3 Composition API
- TypeScript support
- Tailwind CSS styles (requires your app to have Tailwind configured)
- Source code shared (no build step)

## Components

- `VButton` - Button component with variants and sizes
- `VInput` - Form input with v-model, label and error support
