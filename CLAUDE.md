# Pubkytecture

Visual "glass-box" simulator for the Pubky ecosystem. Shows data flow through distributed architecture in real-time with actual network operations.

**Design:** Dark mode only.
**Deployment:** Must run on GitHub Pages (static SPA, no server).
**Testing:** All tests must mock network calls - never write to live Pubky systems.

## Tech Stack

- **Build:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Diagrams:** React Flow (@xyflow/react)
- **Animations:** Framer Motion
- **Pubky:** @synonymdev/pubky v0.6.0-rc.7
- **Testing:** Vitest + Playwright

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/layout/` | App shell: MainLayout, DiagramPanel, ExplanationPanel, ControlBar |
| `src/components/diagram/nodes/` | Custom React Flow nodes for architecture components |
| `src/components/diagram/edges/` | Animated edges for data flow visualization |
| `src/flows/` | Simulation definitions per flow (identity-birth, post-journey) |
| `src/hooks/` | Core hooks including useSimulation state machine |
| `src/lib/` | Pubky client wrapper |
| `e2e/` | Playwright E2E tests |

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run test      # Vitest unit/integration tests
npm run test:e2e  # Playwright E2E tests
```

## Additional Documentation

Check these when working on specific areas:

| File | When to check |
|------|---------------|
| `.claude/docs/architectural_patterns.md` | Visualization design, state management, testing strategy |
| `.claude/skills/test-driven-development/` | Implementing state machine or flow logic (TDD required) |
| `.claude/skills/webapp-testing/` | Writing Playwright E2E tests |
| `.claude/skills/artifacts-builder/` | Building React components, dark mode styling |
| `.claude/skills/software-architecture/` | Architectural decisions, SOLID principles |
