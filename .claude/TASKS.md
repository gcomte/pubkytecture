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
| Initialize Vite + React + TypeScript project | pending | |
| Install all dependencies | pending | pubky, react-flow, tailwind, framer-motion, vitest, playwright |
| Configure Tailwind CSS (dark mode only) | pending | |
| Configure Vitest + React Testing Library | pending | |
| Set up GitHub Actions CI | pending | Lint, type-check, unit tests, build |

### Core State Machine (TDD Required)

| Package | Status | Notes |
|---------|--------|-------|
| Write useSimulation tests | pending | Test-first |
| Implement useSimulation hook | pending | Make tests pass |

### Identity Birth Flow (TDD Required for Logic)

| Package | Status | Notes |
|---------|--------|-------|
| Write Identity Birth step tests | pending | Test-first for step logic |
| Implement Identity Birth step definitions | pending | |
| Create Pubky wrapper (lib/pubky.ts) | pending | Explore API, then add integration tests |

### UI Components

| Package | Status | Notes |
|---------|--------|-------|
| Create MainLayout (three-panel structure) | pending | |
| Set up React Flow canvas with architecture nodes | pending | All nodes visible: Local, PKNS, DHT, Homeserver, Nexus, pubky.app, eventky.app |
| Add data packet animations | pending | Framer Motion |

### Integration & Polish

| Package | Status | Notes |
|---------|--------|-------|
| Wire up Identity Birth flow end-to-end | pending | |
| Add error handling UI | pending | Retry, reset options |
| Write Playwright E2E tests | pending | All network calls mocked |

---

## Completed

| Package | Completed | Notes |
|---------|-----------|-------|
| Create CLAUDE.md and project docs | done | Progressive disclosure structure |
| Create Claude Code Skills | done | 4 skills: TDD, testing, architecture, artifacts |
| Create implementation plan | done | .claude/plans/golden-popping-simon.md |
| Define initial work packages | done | This file |

---

## Review Log

### Review 1 - Initial Setup
**Date:** Session start
**Decisions:** Created 15 work packages grouped by concern
**Next:** Follow "Before Starting Work" to evaluate and select first package

