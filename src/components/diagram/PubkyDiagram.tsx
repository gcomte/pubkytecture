/**
 * PubkyDiagram Component
 *
 * React Flow diagram showing the complete Pubky architecture with data flow:
 *
 * Post Journey Flow (starting from pubky.app):
 * 1. pubky.app → PKDNS → Mainline DHT (lookup homeserver IP)
 * 2. pubky.app → Homeserver (publish post data)
 * 3. Homeserver → Nexus (async indexing)
 * 4. Nexus → pubky.app (read index to display post)
 *
 * Architecture Components:
 * - Mainline DHT: Distributed Hash Table for IP resolution
 * - PKDNS: Pubky DNS resolver
 * - Homeserver: User's data storage
 * - Nexus: Pubky content indexer
 * - Pubky Ring: Mobile authenticator app (holds private keys)
 * - Browser Apps: pubky.app and other apps (run locally in browser)
 * - Web servers: Serve app code only, no user data
 *
 * Key principle: web servers only serve app code.
 * All user data flows between browser apps and Pubky infrastructure.
 * No user data touches web servers (user sovereignty & credible exit).
 */

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ArchitectureNode, type ArchitectureNodeData } from './nodes/ArchitectureNode';
import { GroupNode, type GroupNodeData } from './nodes/GroupNode';

interface PubkyDiagramProps {
  activeNodeId?: string;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
}

export function PubkyDiagram({ activeNodeId, highlightedNodeIds = [], highlightedEdgeIds = [] }: PubkyDiagramProps) {
  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      architecture: ArchitectureNode,
      group: GroupNode,
    }),
    []
  );

  // Define all architecture nodes
  const initialNodes: Node[] = useMemo(
    () => [
      // Mainline DHT - Top left
      {
        id: 'dht',
        type: 'architecture',
        position: { x: 150, y: 30 },
        data: {
          label: 'Mainline DHT',
          description: 'Distributed Hash Table',
          icon: '🌐',
          isActive: activeNodeId === 'dht',
          isHighlighted: highlightedNodeIds.includes('dht'),
        } as ArchitectureNodeData,
      },

      // PKDNS - Below DHT, more to the right
      {
        id: 'pkdns',
        type: 'architecture',
        position: { x: 250, y: 150 },
        data: {
          label: 'PKDNS',
          description: 'Pubky DNS resolver',
          icon: '🔍',
          isActive: activeNodeId === 'pkdns',
          isHighlighted: highlightedNodeIds.includes('pkdns'),
        } as ArchitectureNodeData,
      },

      // Homeserver - Right side
      {
        id: 'homeserver',
        type: 'architecture',
        position: { x: 600, y: 270 },
        data: {
          label: 'Homeserver',
          description: 'Your data storage',
          icon: '🏠',
          isActive: activeNodeId === 'homeserver',
          isHighlighted: highlightedNodeIds.includes('homeserver'),
        } as ArchitectureNodeData,
      },

      // Nexus (Pubky Indexer) - Center, below homeserver
      {
        id: 'nexus',
        type: 'architecture',
        position: { x: 400, y: 400 },
        data: {
          label: 'Nexus',
          description: 'Pubky content indexer',
          icon: '📊',
          isActive: activeNodeId === 'nexus',
          isHighlighted: highlightedNodeIds.includes('nexus'),
        } as ArchitectureNodeData,
      },

      // Pubky Ring - Left side, higher up so Auth label is clear
      {
        id: 'pubky-ring',
        type: 'architecture',
        position: { x: 50, y: 320 },
        data: {
          label: 'Pubky Ring',
          description: 'Mobile authenticator\n(holds your identity)',
          icon: '🔑',
          isActive: activeNodeId === 'pubky-ring',
          isHighlighted: highlightedNodeIds.includes('pubky-ring'),
        } as ArchitectureNodeData,
        style: { zIndex: 20 },
      },

      // Browser Apps Group - Background box
      {
        id: 'browser-apps',
        type: 'group',
        position: { x: 180, y: 550 },
        style: {
          width: 720,
          height: 250,
        },
        data: {
          label: 'Browser Apps (Local)',
          description: "Running locally in your browser.\nDO NOT send any data to the Web Servers.",
        } as GroupNodeData,
        draggable: false,
        selectable: false,
      },

      // pubky.app - Positioned visually inside browser-apps group
      {
        id: 'pubky-app',
        type: 'architecture',
        position: { x: 250, y: 640 },
        data: {
          label: 'pubky.app',
          description: 'Social application',
          icon: '📱',
          isActive: activeNodeId === 'pubky-app',
          isHighlighted: highlightedNodeIds.includes('pubky-app'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },

      // your-app - Generic placeholder - Positioned fully inside browser-apps group
      {
        id: 'your-app',
        type: 'architecture',
        position: { x: 620, y: 640 },
        data: {
          label: 'Any Pubky app',
          description: '(connects to Ring and PKDNS\nlike pubky.app, omitted in\nmodel to reduce noise)',
          icon: '📦',
          isActive: activeNodeId === 'your-app',
          isHighlighted: highlightedNodeIds.includes('your-app'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },

      // pubky.app Web Server - Below browser apps box, left
      {
        id: 'pubky-server',
        type: 'architecture',
        position: { x: 280, y: 820 },
        data: {
          label: 'pubky.app Web Server',
          description: 'Serves app code, no data',
          icon: '🖥️',
          isActive: activeNodeId === 'pubky-server',
          isHighlighted: highlightedNodeIds.includes('pubky-server'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },

      // your-app Web Server - Below browser apps box, right
      {
        id: 'your-app-server',
        type: 'architecture',
        position: { x: 650, y: 820 },
        data: {
          label: 'Web Server',
          description: 'Serves app code, no data',
          icon: '🖥️',
          isActive: activeNodeId === 'your-app-server',
          isHighlighted: highlightedNodeIds.includes('your-app-server'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },
    ],
    [activeNodeId, highlightedNodeIds]
  );

  // Define edges (connections between nodes)
  const initialEdges: Edge[] = useMemo(
    () => [
      // PKDNS → pubky.app (lookup homeserver IP)
      {
        id: 'e-pkdns-pubky',
        source: 'pkdns',
        target: 'pubky-app',
        sourceHandle: 'bottom-source',
        targetHandle: 'left',
        animated: false,
      },

      // PKDNS → DHT (resolve via DHT)
      {
        id: 'e-pkdns-dht',
        source: 'pkdns',
        target: 'dht',
        sourceHandle: 'top-source',
        targetHandle: 'bottom',
        animated: false,
      },

      // pubky.app → Homeserver (publish post data)
      {
        id: 'e-pubky-homeserver',
        source: 'pubky-app',
        target: 'homeserver',
        sourceHandle: 'top-source',
        targetHandle: 'bottom',
        animated: false,
      },

      // Homeserver → Nexus (async indexing)
      {
        id: 'e-homeserver-nexus',
        source: 'homeserver',
        target: 'nexus',
        sourceHandle: 'bottom-source',
        targetHandle: 'top',
        animated: false,
      },

      // Nexus → pubky.app (read index)
      {
        id: 'e-nexus-pubky',
        source: 'nexus',
        target: 'pubky-app',
        sourceHandle: 'bottom-source',
        targetHandle: 'top',
        animated: false,
      },

      // Pubky Ring → pubky.app (authentication)
      {
        id: 'e-ring-pubky',
        source: 'pubky-ring',
        target: 'pubky-app',
        sourceHandle: 'right-source',
        targetHandle: 'left',
        animated: highlightedEdgeIds.includes('e-ring-pubky'),
        style: highlightedEdgeIds.includes('e-ring-pubky')
          ? { stroke: '#3b82f6', strokeWidth: 2 }
          : undefined,
        className: highlightedEdgeIds.includes('e-ring-pubky') ? 'animate-pulse-edge' : undefined,
        label: 'Auth',
        labelStyle: { fill: '#e5e7eb', fontSize: 12, fontWeight: 600 },
        labelBgStyle: { fill: '#18181b', fillOpacity: 1 },
        labelBgPadding: [8, 4] as [number, number],
      },

      // your-app → Homeserver (publish/read data)
      {
        id: 'e-yourapp-homeserver',
        source: 'your-app',
        target: 'homeserver',
        sourceHandle: 'top-source',
        targetHandle: 'bottom',
        animated: false,
      },

      // pubky.app Server → pubky.app (serves app code)
      {
        id: 'e-pubky-server-app',
        source: 'pubky-server',
        target: 'pubky-app',
        sourceHandle: 'top-source',
        targetHandle: 'bottom',
        animated: false,
        style: { stroke: '#6b7280', strokeDasharray: '5,5' },
        label: 'Serves app (code only)',
        labelStyle: { fill: '#e5e7eb', fontSize: 13, fontWeight: 600 },
        labelBgStyle: { fill: '#18181b', fillOpacity: 1 },
        labelBgPadding: [10, 6] as [number, number],
        zIndex: 1000,
      },

      // your-app Server → your-app (serves app code)
      {
        id: 'e-yourapp-server-app',
        source: 'your-app-server',
        target: 'your-app',
        sourceHandle: 'top-source',
        targetHandle: 'bottom',
        animated: false,
        style: { stroke: '#6b7280', strokeDasharray: '5,5' },
        label: 'Serves app (code only)',
        labelStyle: { fill: '#e5e7eb', fontSize: 13, fontWeight: 600 },
        labelBgStyle: { fill: '#18181b', fillOpacity: 1 },
        labelBgPadding: [10, 6] as [number, number],
        zIndex: 1000,
      },
    ],
    [highlightedEdgeIds]
  );

  const onNodesChange = useCallback(() => {
    // Handle node changes if needed for interactivity
  }, []);

  const onEdgesChange = useCallback(() => {
    // Handle edge changes if needed for interactivity
  }, []);

  return (
    <ReactFlow
      nodes={initialNodes}
      edges={initialEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      className="bg-zinc-950"
      minZoom={0.5}
      maxZoom={1.5}
    >
      {/* Grid background */}
      <Background className="bg-zinc-950" color="#27272a" gap={16} />

      {/* Navigation controls */}
      <Controls className="!bg-zinc-900 !border-zinc-700 ![&>button]:!bg-zinc-800 ![&>button]:!border-zinc-700 ![&>button:hover]:!bg-zinc-700" />

      {/* Mini map */}
      <MiniMap
        className="!bg-zinc-900 !border-zinc-700"
        nodeColor="#3f3f46"
        maskColor="rgba(0, 0, 0, 0.6)"
      />
    </ReactFlow>
  );
}
