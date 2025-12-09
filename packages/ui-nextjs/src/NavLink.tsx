'use client';

import Link from 'next/link';
import { type ComponentProps, type ReactNode } from 'react';

export interface NavLinkProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  children: ReactNode;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function NavLink({
  href,
  children,
  activeClassName = 'text-blue-600 font-semibold',
  inactiveClassName = 'text-gray-600 hover:text-gray-900',
  className = '',
  ...props
}: NavLinkProps) {
  // Note: In a real app, you'd use usePathname() from next/navigation
  // to check if the link is active
  const isActive = false; // Simplified for example

  return (
    <Link
      href={href}
      className={`${isActive ? activeClassName : inactiveClassName} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
