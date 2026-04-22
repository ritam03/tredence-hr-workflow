import { useCallback, useRef, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/store';
import { nodeTypes } from '../nodes/CustomNodes';

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  // Fix Warning 1: Memoize nodeTypes so React Flow knows it hasn't mutated
  const nodeTypesMemo = useMemo(() => nodeTypes, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    // Fix Warning 2: Added absolute positioning and inline styles for strict dimensions
    <div className="absolute inset-0 w-full h-full bg-slate-50" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypesMemo}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background color="#ccc" gap={16} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}