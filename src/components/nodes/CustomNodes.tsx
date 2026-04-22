import { Handle, Position, type NodeProps } from 'reactflow';
import { Play, CheckSquare, UserCheck, Settings, Square } from 'lucide-react';
import clsx from 'clsx';

// A shared wrapper to keep our node designs consistent
const NodeWrapper = ({ children, className, selected }: { children: React.ReactNode, className: string, selected?: boolean }) => (
  <div className={clsx(
    "px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[150px]",
    selected ? "border-blue-500 shadow-lg" : "border-gray-200",
    className
  )}>
    {children}
  </div>
);

export const StartNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper className="border-green-500" selected={selected}>
    <div className="flex items-center gap-2">
      <Play className="w-4 h-4 text-green-500" />
      <div className="font-bold text-sm text-slate-700">{data.label || 'Start'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
  </NodeWrapper>
);

export const TaskNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper className="border-blue-400" selected={selected}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-400" />
    <div className="flex items-center gap-2">
      <CheckSquare className="w-4 h-4 text-blue-500" />
      <div className="font-bold text-sm text-slate-700">{data.label || 'Task'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-400" />
  </NodeWrapper>
);

export const ApprovalNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper className="border-purple-400" selected={selected}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-400" />
    <div className="flex items-center gap-2">
      <UserCheck className="w-4 h-4 text-purple-500" />
      <div className="font-bold text-sm text-slate-700">{data.label || 'Approval'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-400" />
  </NodeWrapper>
);

export const AutomatedNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper className="border-orange-400" selected={selected}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-400" />
    <div className="flex items-center gap-2">
      <Settings className="w-4 h-4 text-orange-500" />
      <div className="font-bold text-sm text-slate-700">{data.label || 'Automated'}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-400" />
  </NodeWrapper>
);

export const EndNode = ({ data, selected }: NodeProps) => (
  <NodeWrapper className="border-red-500" selected={selected}>
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-500" />
    <div className="flex items-center gap-2">
      <Square className="w-4 h-4 text-red-500" />
      <div className="font-bold text-sm text-slate-700">{data.label || 'End'}</div>
    </div>
  </NodeWrapper>
);

// We export this object to pass to the ReactFlow component
export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};