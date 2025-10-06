import React from 'react';
import { ThemeProvider as ThemeProviderBase } from '@/contexts/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
}) => {
  return (
    <ThemeProviderBase defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeProviderBase>
  );
};

export default ThemeProvider;
