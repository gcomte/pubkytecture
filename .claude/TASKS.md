# Pubkytecture Tasks

## Workflow Instructions

### Before Starting Work

1. **Read all packages** - Understand current state of the backlog
2. **Evaluate priorities** - For each pending package, consider:
   - What blocks other work?
   - What delivers the most value right now?
   - What dependencies are satisfied?
   - What did we learn that changes importance?
3. **Select highest priority** - Pick the package with greatest impact given current context
4. **Create feature branch** - `git checkout -b feature/task-name` (use kebab-case)
5. **Update status** - Mark as `in-progress` and begin work

### After Completing Work

1. **Mark completed** - Move to Completed section with brief notes on what was done/learned
2. **Update README.md** - Keep it compact and tidy, reflecting current project state
3. **Commit changes** - Create commit with clear message describing what was done
4. **Push branch** - `git push -u origin feature/task-name` (user will create PR on GitHub)
5. **Review all packages** - For each remaining package, ask:
   - Does this package still make sense?
   - Should it be split, merged, or reworded?
   - Should it be removed?
6. **Discover new packages** - Add any work discovered during implementation
7. **Return to "Before Starting Work"** - Re-evaluate priorities fresh and pick next

Priorities are NOT stored. They are evaluated fresh each cycle.

### Work Package Guidelines

Work packages must be **atomic** - small and self-contained:

- **Single deliverable** - One clear outcome per package
- **Completable in one session** - If it takes multiple sessions, split it
- **No hidden dependencies** - All prerequisites explicit
- **Verifiable** - Clear criteria for "done"

When a package feels too large, split it. When packages are too granular, merge them.

---

## Work Packages

### Setup & Infrastructure

| Package | Status | Notes |
|---------|--------|-------|

### Core State Machine (TDD Required)

| Package | Status | Notes |
|---------|--------|-------|

### React Flow Canvas

| Package | Status | Notes |
|---------|--------|-------|

### Post Journey Flow (Priority #1)

| Package | Status | Notes |
|---------|--------|-------|
| Create post input UI | pending | Text input + Publish button on main page |
| Implement Post Journey step logic | pending | Mock post creation → homeserver → nexus → apps |
| Add data packet animations | pending | Framer Motion, animate post flowing through system |
| Wire up Post Journey flow end-to-end | pending | Connect UI + state machine + diagram |

### Identity Birth Flow (Priority #2)

| Package | Status | Notes |
|---------|--------|-------|
| Create Pubky wrapper (lib/pubky.ts) | pending | Explore API, then add integration tests |
| Wire up Identity Birth flow end-to-end | pending | Use existing step definitions |

### Integration & Polish

| Package | Status | Notes |
|---------|--------|-------|
| Add error handling UI | pending | Retry, reset options |
| Add mobile responsiveness | pending | Collapsible panels, touch-friendly controls, responsive layout for small screens |
| Write Playwright E2E tests | pending | All network calls mocked |

---

## Completed

| Package | Completed | Notes |
|---------|-----------|-------|
| Create CLAUDE.md and project docs | done | Progressive disclosure structure |
| Create Claude Code Skills | done | 4 skills: TDD, testing, architecture, artifacts |
| Create implementation plan | done | .claude/plans/golden-popping-simon.md |
| Define initial work packages | done | This file |
| Initialize Vite + React + TypeScript project | done | Manually created config files, GitHub Pages support |
| Install all dependencies | done | pubky, react-flow, tailwind v4, vitest, playwright |
| Configure Tailwind CSS (dark mode only) | done | Using @tailwindcss/postcss with v4 syntax |
| Configure Vitest + React Testing Library | done | vitest.config.ts with jsdom environment |
| Write useSimulation tests | done | Comprehensive TDD test suite (22 test cases), all passing |
| Implement useSimulation hook | done | State machine with refs for async operations, all tests passing |
| Explore Pubky v0.6.0-rc.7 API | done | Documented API flow in src/lib/pubky-exploration.md with Identity Birth example |
| Write Identity Birth step tests | done | TDD test suite (18 test cases) covering all 4 steps, data accumulation, errors |
| Implement Identity Birth step definitions | done | Created 4-step flow (keypair → recovery → signup → verify), all 18 tests passing |
| Create MainLayout (three-panel structure) | done | MainLayout, DiagramPanel, ExplanationPanel, ControlBar with dark mode styling |
| Set up GitHub Actions CI | done | Workflow with lint, type-check, tests, build, and GitHub Pages deployment |
| Set up React Flow canvas with architecture nodes | done | PubkyDiagram with 7 nodes (Local, PKNS, DHT, Homeserver, Nexus, pubky.app, eventky.app), custom ArchitectureNode with active/highlighted states |

---

## Review Log

### Review 1 - Initial Setup
**Date:** Session start
**Decisions:** Created 15 work packages grouped by concern
**Next:** Follow "Before Starting Work" to evaluate and select first package

