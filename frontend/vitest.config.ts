import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vite resolves tsconfig.json "paths" natively, so @/ imports work like in the app
  resolve: { tsconfigPaths: true },
  test: {
    // Node is enough for pure logic; switch to "jsdom" when you start testing components
    environment: "node",
    globals: false,
    // Co-locate tests next to source as *.test.ts
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**"],
      reporter: ["text", "html"],
    },
  },
});
