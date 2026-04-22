import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import Sidebar from './components/canvas/Sidebar';
import NodeFormPanel from './components/forms/NodeFormPanel';
import SandboxModal from './components/sandbox/SandboxModal';
import { Play } from 'lucide-react';

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg">HR Workflow Designer</h1>
        <button 
          onClick={() => setIsSandboxOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          Test Workflow
        </button>
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