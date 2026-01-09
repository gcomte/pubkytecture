---
name: artifacts-builder
description: Use when building React components with Tailwind CSS. Provides patterns for dark mode UI, React Flow nodes, and Framer Motion animations.
---

# Component Building Guide

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS (dark mode only)
- React Flow (@xyflow/react) for diagrams
- Framer Motion for animations

## Dark Mode Design

This app is **dark mode only**. Use Tailwind's dark palette:

```tsx
// Good: Dark backgrounds, light text
<div className="bg-gray-900 text-gray-100">
  <h1 className="text-white">Title</h1>
  <p className="text-gray-400">Subtitle</p>
</div>

// Accent colors for highlights
<div className="bg-blue-600 hover:bg-blue-500">Active</div>
<div className="border-gray-700">Container</div>
```

### Color Palette

| Use | Tailwind Class |
|-----|----------------|
| Background | `bg-gray-900`, `bg-gray-800` |
| Surface/Cards | `bg-gray-800`, `bg-gray-700` |
| Text primary | `text-white`, `text-gray-100` |
| Text secondary | `text-gray-400`, `text-gray-500` |
| Borders | `border-gray-700`, `border-gray-600` |
| Accent (active) | `bg-blue-600`, `text-blue-400` |
| Success | `bg-green-600`, `text-green-400` |
| Error | `bg-red-600`, `text-red-400` |

## Avoid "AI Slop"

Do NOT use:
- Excessive centered layouts
- Purple/violet gradients
- Uniform rounded corners everywhere
- Inter font obsession
- Generic hero sections

## React Flow Nodes

```tsx
// src/components/diagram/nodes/DHTNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';

interface DHTNodeData {
  label: string;
  isActive: boolean;
}

export function DHTNode({ data }: NodeProps<DHTNodeData>) {
  return (
    <motion.div
      className={`
        px-4 py-3 rounded-lg border-2
        ${data.isActive
          ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20'
          : 'bg-gray-800 border-gray-600'
        }
      `}
      animate={data.isActive ? { scale: 1.05 } : { scale: 1 }}
    >
      <Handle type="target" position={Position.Left} className="bg-gray-500" />
      <span className="text-white font-medium">{data.label}</span>
      <Handle type="source" position={Position.Right} className="bg-gray-500" />
    </motion.div>
  );
}
```

## Animated Data Packets

```tsx
// src/components/diagram/DataPacket.tsx
import { motion } from 'framer-motion';

interface DataPacketProps {
  label: string;
  progress: number; // 0 to 1
  pathPoints: { x: number; y: number }[];
}

export function DataPacket({ label, progress, pathPoints }: DataPacketProps) {
  const currentPos = interpolatePath(pathPoints, progress);

  return (
    <motion.div
      className="absolute bg-yellow-500 text-gray-900 px-2 py-1 rounded text-sm font-medium"
      style={{ left: currentPos.x, top: currentPos.y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      {label}
    </motion.div>
  );
}
```

## Layout Components

```tsx
// Main layout structure
<div className="h-screen bg-gray-900 flex flex-col">
  {/* Top: Progress indicator */}
  <header className="h-12 bg-gray-800 border-b border-gray-700">
    <StepIndicator />
  </header>

  {/* Middle: Main content */}
  <main className="flex-1 flex overflow-hidden">
    {/* Left: Diagram */}
    <div className="flex-1">
      <DiagramPanel />
    </div>
    {/* Right: Explanation */}
    <aside className="w-80 bg-gray-800 border-l border-gray-700">
      <ExplanationPanel />
    </aside>
  </main>

  {/* Bottom: Controls */}
  <footer className="h-16 bg-gray-800 border-t border-gray-700">
    <ControlBar />
  </footer>
</div>
```

## Button Styles

```tsx
// Primary action
<button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors">
  Next
</button>

// Secondary action
<button className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-md transition-colors">
  Previous
</button>

// Disabled
<button className="bg-gray-700 text-gray-500 cursor-not-allowed px-4 py-2 rounded-md" disabled>
  Next
</button>
```
