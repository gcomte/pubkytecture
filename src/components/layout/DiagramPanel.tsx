/**
 * DiagramPanel Component
 *
 * Container for the React Flow diagram canvas.
 * Shows the complete Pubky architecture with animated data flows.
 */

import type { ReactNode } from 'react';

interface DiagramPanelProps {
  children: ReactNode;
}

export function DiagramPanel({ children }: DiagramPanelProps) {
  return (
    <div className="h-full w-full">
      {/* React Flow canvas will be rendered here */}
      {children}
    </div>
  );
}
