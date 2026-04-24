import { type Node, type Edge } from 'reactflow';

// Mock GET /automations
export const fetchAutomations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "send_email", label: "Send Email", params: ["to", "subject"] },
        { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] }
      ]);
    }, 500); // Simulate network delay
  });
};

// Mock POST /simulate
export const simulateWorkflow = async (nodes: Node[], edges: Edge[]) => {
  return new Promise<{ success: boolean; log: string[] }>((resolve) => {
    setTimeout(() => {
      const log: string[] = [];
      
      // 1. Validation: Check for Start Node
      const startNodes = nodes.filter(n => n.type === 'start');
      if (startNodes.length === 0) {
        return resolve({ success: false, log: ["Error: No Start Node found. Workflow must begin with a Start Node."] });
      }
      if (startNodes.length > 1) {
        return resolve({ success: false, log: ["Error: Multiple Start Nodes found. Only one is allowed."] });
      }

      // 2. BFS Graph Traversal for Parallel Execution
      const queue: Node[] = [...startNodes];
      const visited = new Set<string>(); // Cycle detection
      let executionSteps = 0;
      const MAX_STEPS = 100; // Increased threshold for complex branching
      
      log.push(`Started simulation at: ${startNodes[0].data.label || 'Start'}`);
      visited.add(startNodes[0].id);
      
      // Process the graph layer by layer
      while (queue.length > 0 && executionSteps < MAX_STEPS) {
        const currentLayerSize = queue.length;
        const parallelExecutionLogs: string[] = [];
        
        // Loop through all nodes at the current execution depth
        for (let i = 0; i < currentLayerSize; i++) {
          const currentNode = queue.shift()!; // Dequeue
          
          const nodeType = currentNode.type || 'default';
          
          if (nodeType !== 'start') {
            parallelExecutionLogs.push(`[${nodeType.toUpperCase()}] ${currentNode.data.label || nodeType}`);
          }

          // Find all outgoing paths from this node
          const outgoingEdges = edges.filter(e => e.source === currentNode.id);
          
          if (outgoingEdges.length === 0) {
            if (nodeType === 'end') {
               log.push(`Reached End Node: ${currentNode.data.label || 'End'}`);
            } else {
               log.push(`Warning: Dead end reached at [${currentNode.data.label || nodeType}]. No further connections.`);
            }
            continue;
          }
          
          // Enqueue all connected target nodes
          for (const edge of outgoingEdges) {
            const nextNode = nodes.find(n => n.id === edge.target);
            
            if (!nextNode) {
               log.push(`Error: Broken connection detected.`);
               continue;
            }
            
            // Cycle prevention
            if (visited.has(nextNode.id)) {
               log.push(`Error: Cycle detected returning to [${nextNode.data.label}]. Infinite loop prevented.`);
               continue;
            }
            
            visited.add(nextNode.id);
            queue.push(nextNode); // Add to next layer of execution
          }
        }

        // Format the output to clearly show parallel processing
        if (parallelExecutionLogs.length > 0) {
          if (parallelExecutionLogs.length > 1) {
            log.push(`Executing Parallel Tasks:\n   -> ` + parallelExecutionLogs.join('\n   -> '));
          } else {
            log.push(`Executing: ${parallelExecutionLogs[0]}`);
          }
        }
        
        executionSteps++;
      }
      
      if (executionSteps >= MAX_STEPS) {
         log.push(`Error: Max execution steps reached. Process terminated.`);
      }
      
      resolve({ success: true, log });
    }, 1000); // Simulate processing time
  });
};