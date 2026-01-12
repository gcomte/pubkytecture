/**
 * ArchitectureNode Component
 *
 * Custom React Flow node representing a component in the Pubky architecture.
 * Supports highlighting, active states, and visual feedback.
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface ArchitectureNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  icon?: string;
}

export const ArchitectureNode = memo(({ data }: NodeProps) => {
  const { label, description, isActive, isHighlighted, icon } = data as ArchitectureNodeData;

  return (
    <div
      className={`
        rounded-lg border-2 bg-zinc-900 px-4 py-3 shadow-lg transition-all
        ${isActive ? 'border-blue-500 shadow-blue-500/50 scale-105' : ''}
        ${isHighlighted ? 'border-purple-500 shadow-purple-500/30' : ''}
        ${!isActive && !isHighlighted ? 'border-zinc-700' : ''}
      `}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!bg-zinc-600 !border-zinc-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!bg-zinc-600 !border-zinc-500"
      />

      {/* Node content */}
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <div className={`font-semibold ${isActive ? 'text-blue-300' : 'text-zinc-100'}`}>
            {label}
          </div>
          {description && (
            <div className="text-xs text-zinc-500 mt-1">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
});

ArchitectureNode.displayName = 'ArchitectureNode';
