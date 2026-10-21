import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest runs without `globals: true`, so React Testing Library's automatic
// cleanup is not registered; without it, rendered elements leak between tests.
afterEach(cleanup);
