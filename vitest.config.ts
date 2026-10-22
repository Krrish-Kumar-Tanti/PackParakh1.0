import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'node:test': resolve(__dirname, 'vitest-node-test-shim.ts')
    }
  },
  test: {
    include: ['server/tests/**/*.test.ts'],
    globals: true,
    environment: 'node',
    reporter: ['verbose'],
    pool: 'forks'
  },
  esbuild: {
    target: 'node20'
  }
});
