/**
 * GroupNode Component
 *
 * Custom React Flow node for grouping related components.
 * Used to visually group nodes together (e.g., browser apps).
 */

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

export interface GroupNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}

export const GroupNode = memo(({ data }: NodeProps) => {
  const { label, description } = data as GroupNodeData;

  return (
    <div
      className="rounded-lg border-2 border-dashed border-zinc-600 bg-zinc-900/50 px-4 py-3 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Group label at the top */}
      <div className="text-sm font-semibold text-zinc-300 mb-1">
        {label}
      </div>
      {description && (
        <div className="text-xs text-zinc-400 whitespace-pre-line">{description}</div>
      )}
    </div>
  );
});

GroupNode.displayName = 'GroupNode';
