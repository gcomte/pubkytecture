/**
 * MainLayout Component
 *
 * Three-panel layout structure for the Pubkytecture simulator:
 * - Left: Diagram Panel (React Flow canvas)
 * - Right: Explanation Panel (educational content, data view)
 * - Bottom: Control Bar (step navigation controls)
 *
 * On mobile (< md breakpoint), the explanation panel is collapsed by default
 * with a toggle button to show/hide it as an overlay.
 */

import { useState } from 'react';
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-x-hidden bg-zinc-950 text-zinc-100">
      <style>{`
        .mobile-menu-button {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background-color: #2563eb;
          border: none;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .mobile-menu-button {
            display: none;
          }
        }
      `}</style>

      {/* Mobile toggle button - Top right, only visible on mobile */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="mobile-menu-button"
        aria-label={isPanelOpen ? 'Close panel' : 'Open panel'}
      >
        {isPanelOpen ? (
          // Close icon (X)
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Menu icon (hamburger)
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile overlay backdrop */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Main content area - Diagram and Explanation panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Diagram Panel - Full width on mobile, flexible on desktop */}
        <div className="flex-1 border-r border-zinc-800 bg-zinc-900">
          {diagramPanel}
        </div>

        {/* Explanation Panel - Fixed width on desktop, overlay on mobile */}
        <div
          className={`
            fixed inset-y-0 right-0 z-50 w-full transform overflow-y-auto bg-zinc-950 p-6 transition-transform duration-300
            md:static md:w-96 md:translate-x-0
            ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
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
