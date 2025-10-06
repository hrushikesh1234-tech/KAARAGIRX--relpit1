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
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
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
