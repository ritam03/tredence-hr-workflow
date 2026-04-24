import { Play, CheckSquare, UserCheck, Settings, Square, Download, Upload } from 'lucide-react';
import { useWorkflowStore } from '../../store/store';
import { useRef } from 'react';

export default function Sidebar() {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  // EXPORT LOGIC
  const handleExport = () => {
    const flowData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([flowData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hr-workflow-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // IMPORT LOGIC
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target?.result as string);
        if (flowData.nodes && flowData.edges) {
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nodeTypes = [
    { type: 'start', label: 'Start', icon: Play, color: 'text-green-500', border: 'border-green-200' },
    { type: 'task', label: 'Task', icon: CheckSquare, color: 'text-blue-500', border: 'border-blue-200' },
    { type: 'approval', label: 'Approval', icon: UserCheck, color: 'text-purple-500', border: 'border-purple-200' },
    { type: 'automated', label: 'Automated', icon: Settings, color: 'text-orange-500', border: 'border-orange-200' },
    { type: 'end', label: 'End', icon: Square, color: 'text-red-500', border: 'border-red-200' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col h-full shadow-sm z-10">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Workflow Nodes</h1>
      
      <div className="flex flex-col gap-3 flex-grow">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
            className={`flex items-center gap-3 p-3 border rounded-md cursor-grab bg-white hover:bg-slate-50 transition-colors ${node.border} shadow-sm`}
          >
            <node.icon className={`w-5 h-5 ${node.color}`} />
            <span className="font-medium text-slate-700">{node.label}</span>
          </div>
        ))}
      </div>

      {/* JSON Import/Export Controls */}
      <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-2">
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium text-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Export JSON
        </button>
        
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImport} 
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium text-sm transition-colors"
        >
          <Upload className="w-4 h-4" /> Import JSON
        </button>
      </div>
    </aside>
  );
}