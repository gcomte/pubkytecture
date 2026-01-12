/**
 * ExplanationPanel Component
 *
 * Right-side panel showing:
 * - Current step title and description
 * - Educational explanations (e.g., "Why Credible Exit?")
 * - Live data view (public keys, session info, etc.)
 * - Location indicator (which node is active)
 * - Optional custom content (children)
 */

import type { ReactNode } from 'react';

interface ExplanationPanelProps {
  stepTitle: string;
  stepDescription: ReactNode;
  concept?: {
    title: string;
    description: ReactNode;
  };
  data?: Record<string, unknown>;
  location?: ReactNode;
  children?: ReactNode;
}

export function ExplanationPanel({
  stepTitle,
  stepDescription,
  concept,
  data,
  location,
  children,
}: ExplanationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Location indicator */}
      {location && (
        <div className="rounded-lg border border-blue-800 bg-blue-950/50 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-400">
            Location
          </div>
          <div className="mt-1 text-sm text-blue-200">{location}</div>
        </div>
      )}

      {/* Current step */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">{stepTitle}</h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-400">
          {stepDescription}
        </p>
      </div>

      {/* Educational concept */}
      {concept && (
        <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
            {concept.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-purple-200">
            {concept.description}
          </p>
        </div>
      )}

      {/* Live data view */}
      {data && Object.keys(data).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Data
          </h3>
          <div className="mt-3 space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="rounded border border-zinc-800 bg-zinc-900 p-3"
              >
                <div className="text-xs font-medium text-zinc-500">{key}</div>
                <div className="mt-1 break-all font-mono text-xs text-zinc-300">
                  {typeof value === 'string'
                    ? value
                    : JSON.stringify(value, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom content */}
      {children}
    </div>
  );
}
