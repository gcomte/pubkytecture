---
name: software-architecture
description: Use when designing component structure, state management, or making architectural decisions. Covers SOLID principles and patterns for this visualization app.
---

# Software Architecture Guide

## Core Principles

### Single Responsibility (SRP)

Each module has one reason to change:

```
✅ Good
src/hooks/useSimulation.ts      → Step-through state machine only
src/lib/pubky.ts                → Pubky client operations only
src/flows/identity-birth/steps.ts → Step definitions only

❌ Bad
src/hooks/useSimulationAndPubky.ts → Mixed concerns
```

### Open/Closed Principle

Add new flows without modifying core simulation logic:

```typescript
// src/flows/types.ts
interface Flow {
  id: string;
  name: string;
  steps: Step[];
  initialData: Record<string, unknown>;
}

// Add new flows by implementing the interface
// src/flows/post-journey/index.ts
export const postJourneyFlow: Flow = {
  id: 'post-journey',
  name: 'The Journey of a Post',
  steps: [...],
  initialData: {},
};
```

### Dependency Inversion

State machine doesn't depend on concrete Pubky implementation:

```typescript
// src/hooks/useSimulation.ts
interface StepExecutor {
  execute(data: StepData): Promise<StepResult>;
}

export function useSimulation(steps: Step[], executor: StepExecutor) {
  // Works with any executor (real or mock)
}
```

## State Management Pattern

### Accumulated State

Each step adds data without replacing previous state:

```typescript
type SimulationState = {
  currentStep: number;
  status: 'idle' | 'loading' | 'complete' | 'error';
  data: Record<string, unknown>; // Accumulates
  error?: Error;
};

// Step 1 completes
{ currentStep: 1, data: { keypair: {...} } }

// Step 2 completes (adds, doesn't replace)
{ currentStep: 2, data: { keypair: {...}, recoveryFile: {...} } }
```

### State Machine Transitions

```
idle → (start) → loading → (success) → complete → (next) → loading → ...
                         → (error)   → error   → (retry) → loading → ...
                                               → (reset) → idle
```

## Component Architecture

### Container/Presenter Split

```
src/components/layout/
├── DiagramPanel.tsx        # Container: connects to state
├── DiagramPanelView.tsx    # Presenter: pure render (optional)

src/components/diagram/nodes/
├── DHTNode.tsx             # Receives props, renders UI
```

### Prop Drilling vs Context

- **Props:** For 1-2 levels (parent → child)
- **Context:** For simulation state accessed by many components

```typescript
// src/context/SimulationContext.tsx
const SimulationContext = createContext<SimulationState | null>(null);

export function useSimulationContext() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('Must be within SimulationProvider');
  return ctx;
}
```

## File Organization

```
src/
├── components/          # UI components (React)
│   ├── layout/         # App shell components
│   ├── diagram/        # React Flow nodes/edges
│   └── ui/             # Reusable primitives
├── flows/              # Flow definitions (data + logic)
│   └── identity-birth/
├── hooks/              # React hooks (state logic)
├── lib/                # Non-React utilities
├── context/            # React contexts
└── types/              # Shared TypeScript types
```

## Error Handling Strategy

### Network Errors

```typescript
type StepResult =
  | { success: true; data: unknown }
  | { success: false; error: Error; retryable: boolean };
```

### UI Error States

- Show error message in explanation panel
- Highlight failed node in diagram
- Offer "Retry" button for retryable errors
- Offer "Reset" for unrecoverable errors

## Performance Considerations

### React Flow

- Use `nodeTypes` and `edgeTypes` outside component to prevent re-registration
- Memoize custom nodes with `React.memo`
- Use `fitView` sparingly (expensive)

### Framer Motion

- Use `layout` prop cautiously (can cause reflows)
- Prefer `transform` animations over `width`/`height`
- Use `AnimatePresence` for exit animations

## Anti-Patterns to Avoid

| Anti-Pattern | Better Approach |
|--------------|-----------------|
| God component | Split by responsibility |
| Props drilling 5+ levels | Use Context |
| Inline styles everywhere | Tailwind classes |
| Business logic in components | Extract to hooks/lib |
| Mutating state directly | Return new objects |
| Catching errors silently | Surface to user |
