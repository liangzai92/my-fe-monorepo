'use client';

import { type ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Container({ children, maxWidth = 'lg', className = '' }: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
  };

  return (
    <div className={`mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`}>{children}</div>
  );
}
