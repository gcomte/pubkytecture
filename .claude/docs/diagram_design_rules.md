# Diagram Design Rules

This document contains all design rules and principles for creating and modifying React Flow diagrams in Pubkytecture.

## Core Principles

### 1. Connection Optimization
- **Connections (edges) must always be as short as possible**
- Use explicit handle positions (top, bottom, left, right) to control connection points
- Choose handles that minimize edge length and crossings

### 2. Component Overlap Prevention
- **Component boxes must NOT cover edges to great extents**
- Position nodes to avoid obscuring connection paths
- Adjust node positions if they block important edges

### 3. Layout Organization
- The **pubky.app → PKDNS connection should be the lefternmost** connection in the diagram
- PKDNS and Mainline DHT should be positioned on the far left
- Nexus should be positioned to the RIGHT of the PKDNS connection path

## Labeling Conventions

### Web Servers
- Label format: `[app-name] Web Server` (e.g., "pubky.app Web Server", "eventky.app Web Server")
- Description: "Serves app code, no data"
- Position: Below the Browser Apps box

### Connection Labels (Edges)
- Web server connections: "Serves app (code only)"
- Font: 13px, weight: 600, color: #e5e7eb
- Background: #18181b with full opacity
- Padding: [10, 6]

### Browser Apps Group Box
- Label: "Browser Apps (Local)"
- Description (two lines):
  ```
  Running locally in your browser.
  DO NOT send any data to the Web Servers.
  ```
- Note: Use "DO NOT" (not "don't") for emphasis
- The description uses `\n` for line break and `whitespace-pre-line` CSS class

## Connection Points (Handles)

### Handle Configuration
Each ArchitectureNode has 8 handles (4 positions × 2 types):
- Top: `top` (target), `top-source` (source)
- Bottom: `bottom` (target), `bottom-source` (source)
- Left: `left` (target), `left-source` (source)
- Right: `right` (target), `right-source` (source)

### Web Server to App Connections
- Source: Top of Web Server box (`top-source` handle)
- Target: Bottom of app box (`bottom` handle)
- Style: Dashed line (`strokeDasharray: '5,5'`)

### General Connection Rules
1. Choose handles that create the shortest path
2. Prefer vertical connections when possible (cleaner)
3. Use diagonal connections only when necessary
4. Avoid crossing edges when possible

## Node Positioning Strategy

### Vertical Hierarchy
1. **Top Level**: Mainline DHT, PKDNS (leftmost)
2. **Middle Level**: Homeserver (center)
3. **Lower Level**: Indexers (Nexus left-center, Eventky Indexer right)
4. **Bottom Level**: Browser Apps box (contains app nodes)
5. **Lowest Level**: Web Servers (below Browser Apps box)

### Spacing Considerations
- Ensure adequate space between nodes to prevent edge overlap
- Test edge routing after position changes
- Adjust positions iteratively to minimize edge coverage

## Testing Checklist

When modifying diagram layouts, verify:
- [ ] All edges use shortest possible paths
- [ ] No nodes significantly cover edge paths
- [ ] Web server connections attach correctly (top → bottom)
- [ ] PKDNS connection is lefternmost
- [ ] Labels are readable and not obscured
- [ ] Browser Apps description spans two lines correctly
- [ ] All nodes are properly aligned for clean visual flow

## Implementation Notes

### React Flow Configuration
- Use explicit `sourceHandle` and `targetHandle` in edge definitions
- Set `zIndex: 10` on critical nodes to ensure proper layering
- Set `zIndex: 1000` on important edges (like web server connections)
- Group box should have lower zIndex than child nodes

### Handle IDs Reference
```typescript
// Source handles (outgoing connections)
sourceHandle: 'top-source' | 'bottom-source' | 'left-source' | 'right-source'

// Target handles (incoming connections)
targetHandle: 'top' | 'bottom' | 'left' | 'right'
```

## Future Considerations

When adding new nodes or connections:
1. Follow the leftmost positioning rule for primary flows
2. Maintain short connection paths
3. Check for edge coverage by nodes
4. Update this document with new patterns or rules discovered
