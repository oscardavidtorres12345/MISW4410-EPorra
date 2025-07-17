import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.js",
        "**/*.test.jsx",
        "**/*.config.js",
        "**/*.config.ts",
        "src/main.jsx",
        "dist/assets/**",
      ],
    },
  },
});
