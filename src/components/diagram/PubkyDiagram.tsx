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
 * Note: eventky.app follows the same pattern (connects to PKDNS and Homeserver)
 * but connections are not shown to keep the diagram tidy.
 *
 * Architecture Components:
 * - Mainline DHT: Distributed Hash Table for IP resolution
 * - PKDNS: Pubky DNS resolver
 * - Homeserver: User's data storage
 * - Nexus: Pubky content indexer
 * - Eventky indexer: Events content indexer
 * - Browser Apps: pubky.app and eventky.app (run locally in browser)
 * - web servers: Serve app code only, no user data
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
}

export function PubkyDiagram({ activeNodeId, highlightedNodeIds = [] }: PubkyDiagramProps) {
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

      // PKDNS - Below DHT, far left
      {
        id: 'pkdns',
        type: 'architecture',
        position: { x: 150, y: 150 },
        data: {
          label: 'PKDNS',
          description: 'Pubky DNS resolver',
          icon: '🔍',
          isActive: activeNodeId === 'pkdns',
          isHighlighted: highlightedNodeIds.includes('pkdns'),
        } as ArchitectureNodeData,
      },

      // Homeserver - Center
      {
        id: 'homeserver',
        type: 'architecture',
        position: { x: 500, y: 270 },
        data: {
          label: 'Homeserver',
          description: 'Your data storage',
          icon: '🏠',
          isActive: activeNodeId === 'homeserver',
          isHighlighted: highlightedNodeIds.includes('homeserver'),
        } as ArchitectureNodeData,
      },

      // Nexus (Pubky Indexer) - Center-left, below homeserver
      {
        id: 'nexus',
        type: 'architecture',
        position: { x: 300, y: 400 },
        data: {
          label: 'Nexus',
          description: 'Pubky content indexer',
          icon: '📊',
          isActive: activeNodeId === 'nexus',
          isHighlighted: highlightedNodeIds.includes('nexus'),
        } as ArchitectureNodeData,
      },

      // Eventky Indexer - Right side, below homeserver
      {
        id: 'eventky-indexer',
        type: 'architecture',
        position: { x: 650, y: 400 },
        data: {
          label: 'Eventky Indexer',
          description: 'Events content indexer',
          icon: '📋',
          isActive: activeNodeId === 'eventky-indexer',
          isHighlighted: highlightedNodeIds.includes('eventky-indexer'),
        } as ArchitectureNodeData,
      },

      // Browser Apps Group - Background box
      {
        id: 'browser-apps',
        type: 'group',
        position: { x: 100, y: 550 },
        style: {
          width: 800,
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
        position: { x: 170, y: 640 },
        data: {
          label: 'pubky.app',
          description: 'Social application',
          icon: '📱',
          isActive: activeNodeId === 'pubky-app',
          isHighlighted: highlightedNodeIds.includes('pubky-app'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },

      // eventky.app - Positioned visually inside browser-apps group
      {
        id: 'eventky-app',
        type: 'architecture',
        position: { x: 610, y: 640 },
        data: {
          label: 'eventky.app',
          description: 'Events application\n(also connects to PKDNS\nand Homeserver, but\nsimplified to reduce noise)',
          icon: '📅',
          isActive: activeNodeId === 'eventky-app',
          isHighlighted: highlightedNodeIds.includes('eventky-app'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },

      // pubky.app Web Server - Below browser apps box, left
      {
        id: 'pubky-server',
        type: 'architecture',
        position: { x: 200, y: 820 },
        data: {
          label: 'pubky.app Web Server',
          description: 'Serves app code, no data',
          icon: '🖥️',
          isActive: activeNodeId === 'pubky-server',
          isHighlighted: highlightedNodeIds.includes('pubky-server'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },

      // eventky.app Web Server - Below browser apps box, right
      {
        id: 'eventky-server',
        type: 'architecture',
        position: { x: 640, y: 820 },
        data: {
          label: 'eventky.app Web Server',
          description: 'Serves app code, no data',
          icon: '🖥️',
          isActive: activeNodeId === 'eventky-server',
          isHighlighted: highlightedNodeIds.includes('eventky-server'),
        } as ArchitectureNodeData,
        style: { zIndex: 10 },
      },
    ],
    [activeNodeId, highlightedNodeIds]
  );

  // Define edges (connections between nodes)
  const initialEdges: Edge[] = useMemo(
    () => [
      // pubky.app → PKDNS (lookup homeserver IP)
      {
        id: 'e-pubky-pkdns',
        source: 'pubky-app',
        target: 'pkdns',
        sourceHandle: 'top-source',
        targetHandle: 'bottom',
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
        sourceHandle: 'left-source',
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

      // Homeserver → Eventky Indexer (async indexing)
      {
        id: 'e-homeserver-eventky-indexer',
        source: 'homeserver',
        target: 'eventky-indexer',
        sourceHandle: 'bottom-source',
        targetHandle: 'top',
        animated: false,
      },

      // Eventky Indexer → eventky.app (read index)
      {
        id: 'e-eventky-indexer-app',
        source: 'eventky-indexer',
        target: 'eventky-app',
        sourceHandle: 'bottom-source',
        targetHandle: 'top',
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

      // eventky.app Server → eventky.app (serves app code)
      {
        id: 'e-eventky-server-app',
        source: 'eventky-server',
        target: 'eventky-app',
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
    []
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
