import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from 'reactflow';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
}

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 250, y: 100 },
    data: { label: 'Start Workflow' },
  },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  
  // React Flow handlers for dragging, selecting, and connecting
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  // Custom store actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node: Node) => {
    set({ nodes: [...get().nodes, node] });
  },
  
  // Update specific node data fields (used by the right-hand form panel)
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      // Also remove any edges connected to this deleted node
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },
}));