
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: [
        "**/.git/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/supabase/**",
      ],
      usePolling: true, // fallback, try polling (less efficient)
      interval: 150, // optional, in ms, reduce polling frequency
    },
  },
  fs: {
    strict: true, // Fails requests outside of allowed dirs
    allow: [
      "./src",
      "./vite.config.ts"
    ],
    followSymlinks: false,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
