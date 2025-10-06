import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("client/src"),
    },
  },
  root: path.resolve("client"),
  server: {
    port: 4000,
    strictPort: false,
    host: true,
    open: true
  },
}); 