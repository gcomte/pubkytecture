/**
 * MainLayout Component
 *
 * Three-panel layout structure for the Pubkytecture simulator:
 * - Left: Diagram Panel (React Flow canvas)
 * - Right: Explanation Panel (educational content, data view)
 * - Bottom: Control Bar (step navigation controls)
 */

import type { ReactNode } from 'react';

interface MainLayoutProps {
  diagramPanel: ReactNode;
  explanationPanel: ReactNode;
  controlBar: ReactNode;
}

export function MainLayout({
  diagramPanel,
  explanationPanel,
  controlBar,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Main content area - Diagram and Explanation panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Diagram Panel - Left side, flexible width */}
        <div className="flex-1 border-r border-zinc-800 bg-zinc-900">
          {diagramPanel}
        </div>

        {/* Explanation Panel - Right side, fixed width */}
        <div className="w-96 overflow-y-auto bg-zinc-950 p-6">
          {explanationPanel}
        </div>
      </div>

      {/* Control Bar - Bottom, fixed height */}
      <div className="border-t border-zinc-800 bg-zinc-900 px-6 py-4">
        {controlBar}
      </div>
    </div>
  );
}
