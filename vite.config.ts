/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// GitHub Pages serves from a subpath; leave base as "./" so the built
// site works whether hosted at a domain root or a repo subpath.
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
  },
});
