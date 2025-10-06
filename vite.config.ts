import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Use Node.js path resolution
const __dirname = process.cwd();

export default defineConfig({
  plugins: [
    react(),
    // Only include basic plugins for production compatibility
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5174,
    strictPort: true,
    hmr: {
      host: '192.168.0.104',
      port: 5174,
      protocol: 'ws'
    },
    cors: true,
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@radix-ui/react-*']
  }
});
