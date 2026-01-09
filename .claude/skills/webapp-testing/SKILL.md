---
name: webapp-testing
description: Use for E2E testing with Playwright. Verifies the step-through wizard flow, diagram interactions, and dark mode UI.
---

# Web Application Testing (Playwright)

## When to Use

- After Identity Birth flow is implemented
- Testing full user flows (step-through wizard)
- Verifying React Flow diagram interactions
- Visual regression testing
- Debugging UI behavior

## Project Setup

Tests live in `e2e/` directory. Run with:

```bash
npm run test:e2e
```

## CRITICAL: No Live System Writes

**E2E tests must NEVER publish data to the live Pubky system.**

Use Playwright's request interception to mock all network calls:

```typescript
// e2e/identity-birth.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Intercept all Pubky/DHT network calls
  await page.route('**/dht/**', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, record: 'mock-dht-record' }),
    });
  });

  await page.route('**/homeserver/**', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ stored: true }),
    });
  });

  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
});
```

## Dark Mode Only

This app uses **dark mode exclusively**. All tests should:
- Verify dark theme is applied
- Use selectors that work with dark color schemes
- Take screenshots to catch visual regressions

## Test Structure

```typescript
test.describe('Identity Birth Flow', () => {
  test('completes full identity creation flow', async ({ page }) => {
    // Step 1: Initial state
    await expect(page.getByText('Generate Keypair')).toBeVisible();

    // Click next to generate keypair (local operation - no network)
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify keypair appears in side panel
    await expect(page.getByTestId('public-key')).toBeVisible();

    // Continue through steps (network calls are mocked)
  });

  test('displays dark mode styling', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(17, 24, 39)');
  });
});
```

## Testing React Flow Diagrams

```typescript
test('highlights active node during step', async ({ page }) => {
  const dhtNode = page.locator('[data-id="dht-node"]');

  // Advance to DHT step
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Verify node is highlighted
  await expect(dhtNode).toHaveClass(/active|highlighted/);
});
```

## Testing Error States

Mock network failures to test error handling:

```typescript
test('shows error when DHT publish fails', async ({ page }) => {
  // Override route to return error
  await page.route('**/dht/**', async (route) => {
    await route.fulfill({ status: 500, body: 'DHT unavailable' });
  });

  // Trigger the DHT step
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Verify error UI
  await expect(page.getByText('Error')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
```

## Best Practices

- Always intercept network calls - no live system writes
- Use `data-testid` attributes for reliable selectors
- Focus on user-visible behavior, not implementation
- Keep tests independent (each test resets state)
- Take screenshots for visual regression testing
