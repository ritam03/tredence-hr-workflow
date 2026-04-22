import { type Node, type Edge } from 'reactflow';

// Mock GET /automations
export const fetchAutomations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "send_email", label: "Send Email", params: ["to", "subject"] },
        { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] }
      ]);
    }, 500);
  });
};

// Mock POST /simulate [cite: 73]
export const simulateWorkflow = async (nodes: Node[], edges: Edge[]) => {
  return new Promise<{ success: boolean; log: string[] }>((resolve) => {
    setTimeout(() => {
      const log: string[] = [];
      
      // 1. Validation: Check for Start Node [cite: 35, 80]
      const startNodes = nodes.filter(n => n.type === 'start');
      if (startNodes.length === 0) {
        return resolve({ success: false, log: ["Error: No Start Node found. Workflow must begin with a Start Node."] });
      }
      if (startNodes.length > 1) {
        return resolve({ success: false, log: ["Error: Multiple Start Nodes found. Only one is allowed."] });
      }

      // 2. Graph Traversal Logic
      let currentNode: Node | undefined = startNodes[0];
      const visited = new Set<string>();
      let executionSteps = 0;
      const MAX_STEPS = 50; // Prevent infinite loops
      
      log.push(`Started simulation at: ${currentNode.data.label || 'Start'}`);
      
      while (currentNode && executionSteps < MAX_STEPS) {
        visited.add(currentNode.id);
        
        // Find outgoing edges from the current node
        const outgoingEdges = edges.filter(e => e.source === currentNode?.id);
        
        if (outgoingEdges.length === 0) {
          if (currentNode.type !== 'end') {
             log.push(`Warning: Workflow ended abruptly at [${currentNode.data.label || currentNode.type}]. No End Node reached.`);
          } else {
             log.push(`Workflow completed successfully at End Node.`);
          }
          break;
        }
        
        // For this prototype, we follow the first path (handles linear workflows)
        const nextEdge = outgoingEdges[0];
        const nextNode = nodes.find(n => n.id === nextEdge.target);
        
        if (!nextNode) {
           log.push(`Error: Broken connection detected.`);
           break;
        }
        
        // Validation: Cycle detection 
        if (visited.has(nextNode.id)) {
           log.push(`Error: Infinite cycle detected at node [${nextNode.data.label}]. Simulation stopped.`);
           break;
        }
        
        log.push(`Executing ${nextNode.type} step: ${nextNode.data.label || nextNode.type}`);
        currentNode = nextNode;
        executionSteps++;
      }
      
      resolve({ success: true, log });
    }, 1000); // Simulate processing time
  });
};