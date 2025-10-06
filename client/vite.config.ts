import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

// Suppress specific warnings for development
if (process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Suppress specific React warnings
  const suppressedWarnings = [
    'UNSAFE_componentWillMount',
    'componentWillMount',
    'componentWillReceiveProps',
    'componentWillUpdate'
  ];

  console.error = (...args) => {
    if (typeof args[0] === 'string' && suppressedWarnings.some(entry => args[0].includes(entry))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args) => {
    if (typeof args[0] === 'string' && suppressedWarnings.some(entry => args[0].includes(entry))) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
  plugins: [react()],
  resolve: {
    alias: [
      { 
        find: '@', 
        replacement: fileURLToPath(new URL('./src', import.meta.url)) 
      }
    ]
  },
  optimizeDeps: {
    force: true,
    include: [
      '@radix-ui/react-slider',
      '@radix-ui/react-compose',
      '@radix-ui/react-context',
      '@radix-ui/react-primitive',
      '@radix-ui/react-use-callback-ref',
      '@radix-ui/react-use-layout-effect',
      '@radix-ui/react-rect',
      '@radix-ui/react-slot',
      'motion/react',
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-dom/client',
      'react-router-dom',
      '@radix-ui/react-use-controllable-state',
      '@radix-ui/react-use-previous',
      '@radix-ui/rect'
    ],
    esbuildOptions: {
      // Ensure proper handling of React
      jsx: 'automatic',
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'UNSAFE_componentWillMount') {
          return;
        }
        warn(warning);
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
