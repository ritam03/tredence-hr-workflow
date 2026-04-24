import { Handle, Position, type NodeProps } from 'reactflow';
import { 
  Play, CheckSquare, UserCheck, Settings, Square, AlertCircle, 
  User, Calendar, Clock, MessageSquare, AlignLeft 
} from 'lucide-react';
import clsx from 'clsx';
import { useWorkflowStore } from '../../store/store';

// Custom Hook for Real-time Edge Validation
const useNodeValidation = (nodeId: string, type: string) => {
  const edges = useWorkflowStore((state) => state.edges);
  const hasIncoming = edges.some((e) => e.target === nodeId);
  const hasOutgoing = edges.some((e) => e.source === nodeId);

  if (type === 'start') return !hasOutgoing; 
  if (type === 'end') return !hasIncoming;   
  return !hasIncoming || !hasOutgoing;       
};

// Upgraded Wrapper with Error States
const NodeWrapper = ({ children, className, selected, isInvalid }: { children: React.ReactNode, className: string, selected?: boolean, isInvalid?: boolean }) => (
  <div className={clsx(
    "px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[200px] max-w-[240px] relative transition-all duration-200",
    selected ? "ring-4 ring-blue-100 border-blue-500 shadow-lg" : "",
    isInvalid ? "border-red-400 bg-red-50" : className
  )}>
    {isInvalid && (
      <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 shadow-sm animate-pulse" title="Missing required connections">
        <AlertCircle className="w-4 h-4 text-white" />
      </div>
    )}
    {children}
  </div>
);

// 1. Start Node
export const StartNode = ({ data, selected, id }: NodeProps) => {
  const isInvalid = useNodeValidation(id, 'start');
  return (
    <NodeWrapper className="border-green-500" selected={selected} isInvalid={isInvalid}>
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-green-600" />
        <div className="font-bold text-sm text-slate-800">{data.label || 'Start Workflow'}</div>
      </div>
      {data.metadata && (
        <div className="mt-2 text-[10px] text-slate-600 bg-green-50/50 px-2 py-1.5 rounded border border-green-100 truncate font-mono">
          {data.metadata}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
    </NodeWrapper>
  );
};

// 2. Task Node (Supercharged)
export const TaskNode = ({ data, selected, id }: NodeProps) => {
  const isInvalid = useNodeValidation(id, 'task');
  return (
    <NodeWrapper className="border-blue-400" selected={selected} isInvalid={isInvalid}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-400" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <CheckSquare className="w-4 h-4 text-blue-500" />
          <div className="font-bold text-sm text-slate-800 truncate">{data.label || 'Task'}</div>
        </div>
        
        {/* Task Details Card */}
        <div className="bg-slate-50 rounded p-2 flex flex-col gap-1.5 border border-slate-200">
          {data.description && (
            <div className="flex items-start gap-1 text-[10px] text-slate-500">
              <AlignLeft className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 italic">{data.description}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">
              <User className="w-3 h-3 text-blue-500" />
              <span className="truncate max-w-[70px]">{data.assignee || 'Unassigned'}</span>
            </div>
            {data.dueDate && (
              <div className="flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded shadow-sm border border-red-100">
                <Calendar className="w-3 h-3" />
                {data.dueDate}
              </div>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-400" />
    </NodeWrapper>
  );
};

// 3. Approval Node (Supercharged)
export const ApprovalNode = ({ data, selected, id }: NodeProps) => {
  const isInvalid = useNodeValidation(id, 'approval');
  return (
    <NodeWrapper className="border-purple-400" selected={selected} isInvalid={isInvalid}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-400" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <UserCheck className="w-4 h-4 text-purple-500" />
          <div className="font-bold text-sm text-slate-800 truncate">{data.label || 'Approval'}</div>
        </div>
        
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-center px-2 py-1 bg-purple-50 border border-purple-100 rounded text-[10px]">
            <span className="text-purple-600 font-semibold uppercase tracking-wider">Role:</span>
            <span className="font-bold text-purple-900">{data.approverRole || 'Manager'}</span>
          </div>
          {(data.threshold !== undefined && data.threshold !== 0) && (
             <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 bg-slate-50 py-1 rounded border border-slate-100">
               <Clock className="w-3 h-3" />
               Auto-approves in <span className="font-bold text-slate-700">{data.threshold} days</span>
             </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-400" />
    </NodeWrapper>
  );
};

// 4. Automated Step Node
export const AutomatedNode = ({ data, selected, id }: NodeProps) => {
  const isInvalid = useNodeValidation(id, 'automated');
  return (
    <NodeWrapper className="border-orange-400" selected={selected} isInvalid={isInvalid}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-400" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-orange-500" />
          <div className="font-bold text-sm text-slate-800 truncate">{data.label || 'Automated'}</div>
        </div>
        <div className="mt-1 w-full">
          <div className="px-2 py-1.5 bg-slate-800 text-orange-300 text-[10px] rounded font-mono shadow-inner truncate">
            {data.actionType ? `> run ${data.actionType}()` : '> action_unconfigured'}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-400" />
    </NodeWrapper>
  );
};

// 5. End Node (Supercharged)
export const EndNode = ({ data, selected, id }: NodeProps) => {
  const isInvalid = useNodeValidation(id, 'end');
  return (
    <NodeWrapper className="border-red-500" selected={selected} isInvalid={isInvalid}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-500" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 text-red-500" />
          <div className="font-bold text-sm text-slate-800 truncate">{data.label || 'End Workflow'}</div>
        </div>
        
        {data.endMessage && (
           <div className="mt-2 flex items-start gap-1 text-[10px] text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-100">
             <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-400" />
             <span className="line-clamp-2">"{data.endMessage}"</span>
           </div>
        )}
        
        {data.summaryFlag && (
          <div className="mt-2 text-[10px] text-green-700 font-bold bg-green-100 border border-green-300 px-2 py-1 rounded shadow-sm text-center">
            📄 Generates Summary Report
          </div>
        )}
      </div>
    </NodeWrapper>
  );
};

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};