// Shim to allow Vitest to run Node-native test files (import from 'node:test')
// This file re-exports Vitest's globals as Node:test API for compatibility
import { describe as vitestDescribe, it as vitestIt, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';

export const describe = vitestDescribe;
export const it = vitestIt;
export const before = beforeAll;
export { beforeAll, beforeEach, afterAll, afterEach };
