# Architectural Patterns

## Visualization Architecture

### Full System Visibility
The React Flow canvas always displays the complete architecture:
- Local Machine
- PKNS
- Mainline DHT
- Homeserver
- Nexus
- pubky.app (web application)
- eventky.app (web application)

Individual steps highlight relevant nodes rather than showing/hiding them.

**Rationale:** Users learning distributed systems need constant spatial awareness of where components live and how they relate.

### Data Flow Animation
Data movement between nodes uses a three-phase animation:
1. **Generation** - Data appears at source node with highlight
2. **Transit** - Labeled packet animates along edge (e.g., "PKARR Record")
3. **Arrival** - Destination node pulses, packet absorbed

**Rationale:** Makes invisible network operations tangible. Semi-literal labels (data type, not full content) keep diagrams readable while maintaining educational value.

### Location Awareness
Every step displays a prominent location badge indicating where the operation executes:
- Local Machine (key generation, signing)
- PKNS (name resolution layer)
- Mainline DHT (PKARR publishing, resolution)
- Homeserver (data storage)
- Nexus (indexing)
- pubky.app / eventky.app (user-facing web applications)

## State Management

### Step-Through State Machine
Core simulation state managed by `useSimulation` hook:
- Sequential step progression (no skipping)
- Previous navigates view-only (no state rollback)
- Reset clears all accumulated data
- Steps may involve network operations (user waits for completion)
- Loading state shown during network operations
- Errors displayed with retry option

### Accumulated Data Pattern
Each step may produce data that subsequent steps consume. State accumulates rather than replaces:
```
Step 1: { keypair: ... }
Step 2: { keypair: ..., recoveryFile: ... }
Step 3: { keypair: ..., recoveryFile: ..., dhtRecord: ... }
```

## Testing Strategy

### Hybrid TDD
- **Pure logic (TDD):** State machine, step definitions - write tests first
- **Integration (tests after):** Pubky wrapper - explore API behavior first, then lock down with tests
- **UI (tests after):** Visual components - build first, add critical interaction tests
- **E2E (tests after):** Full flow validation with Playwright

**Rationale:** TDD works best when interfaces are known. External APIs and visual components benefit from exploration before testing.
