import { useState } from 'react';
import { useWorkflowStore } from '../../store/store';
import { simulateWorkflow } from '../../api/mockApi';
import { X, Play, Loader2 } from 'lucide-react';

interface SandboxModalProps {
  onClose: () => void;
}

export default function SandboxModal({ onClose }: SandboxModalProps) {
  const { nodes, edges } = useWorkflowStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setLogs(["Preparing simulation payload..."]);
    
    // Serialize graph [cite: 77]
    const payload = { nodes, edges };
    console.log("Serialized Workflow Payload:", JSON.stringify(payload, null, 2));

    // Send to mock API [cite: 78]
    const response = await simulateWorkflow(nodes, edges);
    setLogs((prev) => [...prev, ...response.log]);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Workflow Sandbox</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              This sandbox validates the workflow structure and simulates execution. 
            </p>
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Simulating..." : "Run Simulation"}
            </button>
          </div>

          {/* Log Window */}
          <div className="flex-grow bg-slate-900 rounded-md p-4 overflow-y-auto font-mono text-sm shadow-inner min-h-[200px]">
            {logs.length === 0 ? (
              <span className="text-slate-500">Ready to simulate. Click 'Run Simulation'.</span>
            ) : (
              <ul className="space-y-2">
                {logs.map((log, index) => (
                  <li key={index} className={log.includes('Error') ? 'text-red-400' : log.includes('Warning') ? 'text-yellow-400' : log.includes('✅') || log.includes('🏁') ? 'text-green-400' : 'text-blue-300'}>
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}