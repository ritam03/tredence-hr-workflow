import { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/store';
import { fetchAutomations } from '../../api/mockApi';
import { Trash2 } from 'lucide-react';

export default function NodeFormPanel() {
  const { nodes, updateNodeData, deleteNode } = useWorkflowStore();
  const [automations, setAutomations] = useState<any[]>([]);

  // Fetch from the Mock API layer as required by the case study
  useEffect(() => {
    fetchAutomations().then((data) => setAutomations(data as any[]));
  }, []);

  const selectedNode = nodes.find((node) => node.selected);

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-gray-200 bg-white p-6 flex flex-col hidden lg:flex shadow-sm z-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Configuration</h2>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center mt-4">
          <p className="text-sm text-slate-500">Select a node on the canvas to edit its properties.</p>
        </div>
      </aside>
    );
  }

  const handleChange = (key: string, value: string | boolean | number) => {
    updateNodeData(selectedNode.id, { [key]: value });
  };

  return (
    <aside className="w-80 border-l border-gray-200 bg-white p-6 flex flex-col hidden lg:flex shadow-sm z-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Edit Node</h2>
        <span className="px-2 py-1 bg-slate-100 text-xs font-semibold text-slate-600 rounded uppercase">
          {selectedNode.type}
        </span>
      </div>

      <div className="space-y-4 flex-grow">
        {/* Global Label Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title (Required)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            value={selectedNode.data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </div>

        {/* Start Node Fields */}
        {selectedNode.type === 'start' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Metadata (Key-Value)</label>
            <input type="text" placeholder="e.g. source=web" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={selectedNode.data.metadata || ''} onChange={(e) => handleChange('metadata', e.target.value)} />
          </div>
        )}

        {/* Task Node Fields */}
        {selectedNode.type === 'task' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" rows={2}
                value={selectedNode.data.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={selectedNode.data.assignee || ''} onChange={(e) => handleChange('assignee', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={selectedNode.data.dueDate || ''} onChange={(e) => handleChange('dueDate', e.target.value)} />
            </div>
          </>
        )}

        {/* Approval Node Fields */}
        {selectedNode.type === 'approval' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Approver Role</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={selectedNode.data.approverRole || 'Manager'} onChange={(e) => handleChange('approverRole', e.target.value)}>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Auto-approve Threshold (Days)</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={selectedNode.data.threshold || 0} onChange={(e) => handleChange('threshold', Number(e.target.value))} />
            </div>
          </>
        )}

        {/* Automated Step Node Fields */}
        {selectedNode.type === 'automated' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Choose Action (from API)</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={selectedNode.data.actionType || ''} onChange={(e) => handleChange('actionType', e.target.value)}>
              <option value="" disabled>Select an action...</option>
              {automations.map((action) => (
                <option key={action.id} value={action.id}>{action.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Parameters auto-injected based on selection.</p>
          </div>
        )}

        {/* End Node Fields */}
        {selectedNode.type === 'end' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Message</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={selectedNode.data.endMessage || ''} onChange={(e) => handleChange('endMessage', e.target.value)} />
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={selectedNode.data.summaryFlag || false} onChange={(e) => handleChange('summaryFlag', e.target.checked)} />
              <label className="text-sm font-medium text-slate-700">Generate Summary Report</label>
            </div>
          </>
        )}
      </div>

      {/* Delete Button */}
      <div className="mt-8 pt-4 border-t border-slate-200">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </aside>
  );
}