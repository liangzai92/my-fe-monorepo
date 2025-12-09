# @my-fe/ui-nextjs

Next.js specific components library (App Router).

## Usage

```tsx
import { NavLink, Container } from '@my-fe/ui-nextjs';

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
      </nav>

      <Container maxWidth="lg">
        {children}
      </Container>
    </div>
  );
}
```

## Features

- Next.js 15+ App Router support
- Client Components (marked with 'use client')
- TypeScript support
- Tailwind CSS styles
- Source code shared (no build step)

## Components

- `NavLink` - Enhanced Link component with active state styling
- `Container` - Responsive container with max-width variants
