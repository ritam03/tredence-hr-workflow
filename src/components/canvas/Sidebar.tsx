import { Play, CheckSquare, UserCheck, Settings, Square } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
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
      <div className="flex flex-col gap-3">
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
    </aside>
  );
}