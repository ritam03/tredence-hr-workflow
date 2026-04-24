import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import Sidebar from './components/canvas/Sidebar';
import NodeFormPanel from './components/forms/NodeFormPanel';
import SandboxModal from './components/sandbox/SandboxModal';
import { Play, Undo2, Redo2, LayoutList } from 'lucide-react';
import { useWorkflowStore } from './store/store';
import { useStore } from 'zustand';
import { getLayoutedElements } from './utils/layout';

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  // Access the temporal store for Undo/Redo
  const temporalState = useStore(useWorkflowStore.temporal);
  const { undo, redo, pastStates, futureStates } = temporalState;
  
  // Access standard store for Layout
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();

  // The Auto-Layout Trigger
  const onLayout = () => {
    const { layoutedNodes, layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg">HR Workflow Designer</h1>
        
        <div className="flex items-center gap-4">
          
          {/* Auto Layout Button */}
          <button 
            onClick={onLayout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors"
            title="Auto-organize nodes"
          >
            <LayoutList className="w-4 h-4 text-blue-600" />
            Auto-Layout
          </button>

          {/* Undo / Redo Controls */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border border-slate-200 shadow-inner">
            <button 
              onClick={() => undo()} 
              disabled={pastStates.length === 0}
              className="p-1.5 rounded text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300"></div>
            <button 
              onClick={() => redo()} 
              disabled={futureStates.length === 0}
              className="p-1.5 rounded text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Test Sandbox Button */}
          <button 
            onClick={() => setIsSandboxOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Test Workflow
          </button>
        </div>
      </header>

      {/* Main App Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 h-full relative">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </main>
        
        <NodeFormPanel />
      </div>

      {/* Modals */}
      {isSandboxOpen && <SandboxModal onClose={() => setIsSandboxOpen(false)} />}
    </div>
  );
}

export default App;