---
name: test-driven-development
description: Use when implementing state machine logic, step definitions, or flow logic. NOT required for UI components or initial Pubky wrapper exploration.
---

# Test-Driven Development (Hybrid Approach)

## When TDD is REQUIRED

**Always test-first for:**
- `useSimulation` state machine (src/hooks/)
- Step definitions and flow logic (src/flows/)
- Pure utility functions

**Test-after for:**
- Pubky wrapper (explore API first, then lock down with tests)
- UI components (build first, add critical interaction tests)
- E2E flows (Playwright tests after feature works)

## The Iron Law (For Required Layers)

```
NO STATE MACHINE CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

## Red-Green-Refactor

### RED - Write Failing Test

```typescript
// src/hooks/useSimulation.test.ts
import { describe, it, expect } from 'vitest';
import { useSimulation } from './useSimulation';
import { renderHook, act } from '@testing-library/react';

describe('useSimulation', () => {
  it('starts at step 0 with idle status', () => {
    const { result } = renderHook(() => useSimulation({ totalSteps: 5 }));

    expect(result.current.currentStep).toBe(0);
    expect(result.current.status).toBe('idle');
  });
});
```

### Verify RED

```bash
npm run test src/hooks/useSimulation.test.ts
```

Confirm test fails because feature is missing (not typos).

### GREEN - Minimal Code

Write simplest code to pass:

```typescript
// src/hooks/useSimulation.ts
export function useSimulation({ totalSteps }: { totalSteps: number }) {
  return {
    currentStep: 0,
    status: 'idle' as const,
    totalSteps,
  };
}
```

### Verify GREEN

```bash
npm run test
```

All tests pass. No warnings.

### REFACTOR

Clean up while keeping tests green.

## Project-Specific Testing Stack

- **Unit/Integration:** Vitest + @testing-library/react
- **E2E:** Playwright
- **Run tests:** `npm run test`
- **Run E2E:** `npm run test:e2e`

## CRITICAL: Mock All Network Calls in Tests

This app connects to **live public Pubky infrastructure** at runtime. Tests must **never** write to live systems.

**Always mock in tests:**
- Pubky client operations
- DHT publishing/resolution
- Homeserver calls
- Any network I/O

```typescript
// Example: Mocking Pubky operations in tests
vi.mock('@/lib/pubky', () => ({
  generateKeypair: vi.fn(() => ({
    publicKey: 'mock-public-key-abc123',
    secretKey: 'mock-secret-key-xyz789',
  })),
  publishToDHT: vi.fn(() => Promise.resolve({ success: true })),
}));
```

**Rationale:** The app demonstrates real Pubky flows to users. Tests verify our logic without polluting the live DHT with test data.

## Verification Checklist (For TDD Layers)

Before marking work complete:

- [ ] Every state machine function has a test
- [ ] Watched each test fail before implementing
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass (`npm run test`)
- [ ] All network calls are mocked (no live system writes)
- [ ] Edge cases covered (error states, boundaries)

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test hook | Use `renderHook` from @testing-library/react |
| Test too complicated | State logic too coupled. Simplify. |
| Need to test async step | Use `act()` and `await` in test |
| Need to verify Pubky integration | Manual test in dev, mock in automated tests |
