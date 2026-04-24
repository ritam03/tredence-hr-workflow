import dagre from 'dagre';
import { type Node, type Edge } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// We use slightly larger dimensions here to accommodate the supercharged nodes we just built
const nodeWidth = 240; 
const nodeHeight = 150;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = { ...node };

    // Dagre's center is the middle of the node, but React Flow's origin is the top-left.
    // We adjust the math here so the nodes don't jump around weirdly.
    newNode.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return newNode;
  });

  return { layoutedNodes, layoutedEdges: edges };
};