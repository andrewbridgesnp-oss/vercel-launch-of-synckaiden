import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Play, Save, Trash2, Plus, Settings, GitBranch, Zap, Database, Mail, Webhook, Calendar, FileText, Code } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai-agent';
  name: string;
  icon: any;
  x: number;
  y: number;
  config?: any;
}

interface Connection {
  from: string;
  to: string;
}

const nodeTypes = [
  { type: 'trigger', name: 'Webhook Trigger', icon: Webhook, color: 'purple' },
  { type: 'trigger', name: 'Schedule Trigger', icon: Calendar, color: 'purple' },
  { type: 'trigger', name: 'Event Trigger', icon: Zap, color: 'purple' },
  { type: 'action', name: 'Send Email', icon: Mail, color: 'blue' },
  { type: 'action', name: 'Database Query', icon: Database, color: 'blue' },
  { type: 'action', name: 'HTTP Request', icon: Code, color: 'blue' },
  { type: 'action', name: 'Create Document', icon: FileText, color: 'blue' },
  { type: 'condition', name: 'IF Condition', icon: GitBranch, color: 'yellow' },
  { type: 'ai-agent', name: 'Agent Alpha', icon: Zap, color: 'green' },
  { type: 'ai-agent', name: 'Agent Beta', icon: Zap, color: 'green' },
  { type: 'ai-agent', name: 'Agent Gamma', icon: Zap, color: 'green' },
];

function DraggableNode({ node, onDrag }: { node: WorkflowNode; onDrag: (id: string, x: number, y: number) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'workflow-node',
    item: { id: node.id, x: node.x, y: node.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = node.icon;

  return (
    <div
      ref={drag}
      className={`absolute cursor-move transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
    >
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg border border-blue-600/50 p-4 shadow-lg min-w-[180px]">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 rounded-lg bg-${getNodeColor(node.type)}-500/20 flex items-center justify-center`}>
            <Icon className={`w-4 h-4 text-${getNodeColor(node.type)}-400`} />
          </div>
          <div className="flex-1">
            <div className="text-white text-sm">{node.name}</div>
            <div className="text-blue-400 text-xs">{node.type}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs transition-colors">
            <Settings className="w-3 h-3 mx-auto" />
          </button>
          <button className="flex-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition-colors">
            <Trash2 className="w-3 h-3 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getNodeColor(type: string) {
  switch (type) {
    case 'trigger': return 'purple';
    case 'action': return 'blue';
    case 'condition': return 'yellow';
    case 'ai-agent': return 'green';
    default: return 'blue';
  }
}

function WorkflowCanvas({ nodes, onDrop, onDrag }: {
  nodes: WorkflowNode[];
  onDrop: (x: number, y: number) => void;
  onDrag: (id: string, x: number, y: number) => void;
}) {
  const [, drop] = useDrop(() => ({
    accept: ['palette-node', 'workflow-node'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvasRect = document.getElementById('workflow-canvas')?.getBoundingClientRect();
        if (canvasRect) {
          const x = offset.x - canvasRect.left;
          const y = offset.y - canvasRect.top;
          if (item.id) {
            onDrag(item.id, x, y);
          } else {
            onDrop(x, y);
          }
        }
      }
    },
  }));

  return (
    <div
      ref={drop}
      id="workflow-canvas"
      className="relative h-[600px] bg-slate-950/50 rounded-xl border border-blue-700/30 overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-blue-500/20" />
          ))}
        </div>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((otherNode, j) => {
            if (Math.abs(node.x - otherNode.x) < 300 && Math.abs(node.y - otherNode.y) < 200) {
              return (
                <path
                  key={`${i}-${j}`}
                  d={`M ${node.x} ${node.y} Q ${(node.x + otherNode.x) / 2} ${node.y} ${otherNode.x} ${otherNode.y}`}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  fill="none"
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <DraggableNode key={node.id} node={node} onDrag={onDrag} />
      ))}

      {/* Instructions */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitBranch className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-white mb-2">Start Building Your Workflow</h3>
            <p className="text-blue-300 text-sm">Drag and drop nodes from the palette to begin</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PaletteNode({ node }: { node: any }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'palette-node',
    item: { nodeType: node },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = node.icon;

  return (
    <div
      ref={drag}
      className={`p-3 bg-slate-900/50 rounded-lg border border-blue-800/30 cursor-move hover:border-blue-600/50 transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg bg-${node.color}-500/20 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 text-${node.color}-400`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm truncate">{node.name}</div>
          <div className="text-blue-400 text-xs">{node.type}</div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');

  let nodeIdCounter = 0;

  const handleDrop = useCallback((x: number, y: number) => {
    // This would be called from the canvas when a new node is dropped
    // For demo purposes, we'll add nodes through the palette
  }, []);

  const handleDrag = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node =>
      node.id === id ? { ...node, x, y } : node
    ));
  }, []);

  const addNode = (nodeType: any, x: number = Math.random() * 600 + 100, y: number = Math.random() * 400 + 100) => {
    const newNode: WorkflowNode = {
      id: `node-${nodeIdCounter++}-${Date.now()}`,
      type: nodeType.type as any,
      name: nodeType.name,
      icon: nodeType.icon,
      x,
      y,
    };
    setNodes(prev => [...prev, newNode]);
  };

  const loadTemplate = (template: string) => {
    setNodes([]);
    nodeIdCounter = 0;
    
    // Load different templates
    if (template === 'customer-onboarding') {
      setWorkflowName('Customer Onboarding Flow');
      setTimeout(() => {
        addNode(nodeTypes[0], 150, 100); // Webhook trigger
        addNode(nodeTypes[8], 350, 100); // Agent Alpha
        addNode(nodeTypes[3], 550, 100); // Send Email
        addNode(nodeTypes[4], 350, 250); // Database
      }, 100);
    } else if (template === 'market-intelligence') {
      setWorkflowName('Market Intelligence Pipeline');
      setTimeout(() => {
        addNode(nodeTypes[1], 150, 150); // Schedule trigger
        addNode(nodeTypes[9], 350, 150); // Agent Beta
        addNode(nodeTypes[10], 550, 150); // Agent Gamma
        addNode(nodeTypes[6], 450, 300); // Create Document
      }, 100);
    }
    
    setSelectedTemplate(template);
  };

  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes,
      timestamp: new Date().toISOString(),
    };
    console.log('Saving workflow:', workflow);
    alert(`Workflow "${workflowName}" saved successfully!`);
  };

  const deployWorkflow = () => {
    if (nodes.length === 0) {
      alert('Please add nodes to your workflow before deploying.');
      return;
    }
    alert(`Deploying workflow "${workflowName}" to production swarm!`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-white text-2xl bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2"
            />
            <p className="text-blue-300 mt-1">Drag and drop to design your autonomous workflow</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveWorkflow}
              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors flex items-center gap-2 border border-blue-600/30"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={deployWorkflow}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Deploy to Swarm
            </button>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { id: 'customer-onboarding', name: 'Customer Onboarding', icon: '👋' },
            { id: 'market-intelligence', name: 'Market Intelligence', icon: '📊' },
            { id: 'risk-monitoring', name: 'Risk Monitoring', icon: '⚠️' },
            { id: 'blank', name: 'Start from Scratch', icon: '✨' },
          ].map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.id)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                selectedTemplate === template.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900/50 text-blue-300 hover:bg-slate-900 border border-blue-800/30'
              }`}
            >
              <span className="mr-2">{template.icon}</span>
              {template.name}
            </button>
          ))}
        </div>

        {/* Main Builder Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Node Palette */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-4">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Node Palette
              </h3>
              <div className="space-y-2">
                {nodeTypes.map((node, i) => (
                  <div key={i} onClick={() => addNode(node)}>
                    <PaletteNode node={node} />
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Stats */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-4">
              <h3 className="text-white mb-3">Workflow Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-300 text-sm">Total Nodes</span>
                  <span className="text-white">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300 text-sm">Triggers</span>
                  <span className="text-purple-400">{nodes.filter(n => n.type === 'trigger').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300 text-sm">Actions</span>
                  <span className="text-blue-400">{nodes.filter(n => n.type === 'action').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300 text-sm">AI Agents</span>
                  <span className="text-green-400">{nodes.filter(n => n.type === 'ai-agent').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <WorkflowCanvas nodes={nodes} onDrop={handleDrop} onDrag={handleDrag} />
            
            {/* Controls */}
            <div className="mt-4 flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30">
              <div className="flex gap-3">
                <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-blue-400 rounded-lg transition-colors text-sm">
                  Zoom In
                </button>
                <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-blue-400 rounded-lg transition-colors text-sm">
                  Zoom Out
                </button>
                <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-blue-400 rounded-lg transition-colors text-sm">
                  Center View
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setNodes([])}
                  className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
                >
                  Clear All
                </button>
                <button className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm">
                  Auto-Layout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
