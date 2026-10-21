import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, type Plugin } from 'vitest/config';

// Test-only config: intentionally avoids the react-router / sentry app plugins
// so the Vite server shuts down cleanly after a test run.
export default defineConfig({
  plugins: [tsconfigPaths() as unknown as Plugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    // The app compiles JSX with the react-router compiler; tests go through
    // esbuild, which needs the automatic JSX runtime explicitly.
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    setupFiles: ['./src/tests/setup.ts'],
  },
});
