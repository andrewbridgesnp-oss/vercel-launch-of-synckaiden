import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  UserCheck, 
  Webhook,
  Users,
  Calendar,
  ShoppingCart,
  DollarSign,
  Zap,
  Plus,
  Trash2,
  ArrowRight
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "action";
  tool: string;
  label: string;
  icon: any;
  x: number;
  y: number;
  config?: any;
}

interface Connection {
  from: string;
  to: string;
}

const AVAILABLE_TRIGGERS = [
  { id: "lead_captured", label: "Lead Captured", icon: UserCheck, color: "#4ade80" },
  { id: "appointment_scheduled", label: "Appointment Scheduled", icon: Calendar, color: "#60a5fa" },
  { id: "order_placed", label: "Order Placed", icon: ShoppingCart, color: "#f59e0b" },
  { id: "payment_received", label: "Payment Received", icon: DollarSign, color: "#10b981" },
  { id: "email_opened", label: "Email Opened", icon: Mail, color: "#8b5cf6" },
  { id: "campaign_sent", label: "Campaign Sent", icon: Zap, color: "#ec4899" },
];

const AVAILABLE_ACTIONS = [
  { id: "send_email", label: "Send Email", icon: Mail, color: "#8b5cf6" },
  { id: "send_sms", label: "Send SMS", icon: MessageSquare, color: "#06b6d4" },
  { id: "create_notification", label: "Create Notification", icon: Bell, color: "#f59e0b" },
  { id: "update_lead", label: "Update Lead", icon: UserCheck, color: "#4ade80" },
  { id: "call_webhook", label: "Call Webhook", icon: Webhook, color: "#ec4899" },
];

export function VisualWorkflowCanvas({ 
  onSave 
}: { 
  onSave: (workflow: { trigger: string; actions: any[] }) => void 
}) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addTrigger = (triggerId: string) => {
    // Remove existing trigger if any
    const filtered = nodes.filter(n => n.type !== "trigger");
    
    const trigger = AVAILABLE_TRIGGERS.find(t => t.id === triggerId);
    if (!trigger) return;

    const newNode: WorkflowNode = {
      id: `trigger-${Date.now()}`,
      type: "trigger",
      tool: triggerId,
      label: trigger.label,
      icon: trigger.icon,
      x: 100,
      y: 200,
    };

    setNodes([...filtered, newNode]);
  };

  const addAction = (actionId: string) => {
    const action = AVAILABLE_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    const existingActions = nodes.filter(n => n.type === "action");
    const newNode: WorkflowNode = {
      id: `action-${Date.now()}`,
      type: "action",
      tool: actionId,
      label: action.label,
      icon: action.icon,
      x: 400 + (existingActions.length * 250),
      y: 200,
    };

    setNodes([...nodes, newNode]);

    // Auto-connect to previous node
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      setConnections([...connections, { from: lastNode.id, to: newNode.id }]);
    }
  };

  const removeNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
  };

  const handleNodeDragStart = (nodeId: string) => {
    setDraggingNode(nodeId);
  };

  const handleNodeDrag = (nodeId: string, deltaX: number, deltaY: number) => {
    setNodes(nodes.map(n => 
      n.id === nodeId 
        ? { ...n, x: n.x + deltaX, y: n.y + deltaY }
        : n
    ));
  };

  const handleSave = () => {
    const trigger = nodes.find(n => n.type === "trigger");
    if (!trigger) {
      alert("Please add a trigger to your workflow");
      return;
    }

    const actions = nodes
      .filter(n => n.type === "action")
      .sort((a, b) => a.x - b.x) // Sort by X position (left to right)
      .map(n => ({
        type: n.tool,
        config: n.config || {}
      }));

    if (actions.length === 0) {
      alert("Please add at least one action to your workflow");
      return;
    }

    onSave({
      trigger: trigger.tool,
      actions
    });
  };

  return (
    <div className="space-y-6">
      {/* Tool Palette */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Triggers (Choose One)</h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TRIGGERS.map(trigger => (
              <Button
                key={trigger.id}
                size="sm"
                variant="outline"
                onClick={() => addTrigger(trigger.id)}
                className="border-border/50 hover:border-primary/50"
                style={{ borderColor: trigger.color + "40" }}
              >
                <trigger.icon className="w-4 h-4 mr-2" style={{ color: trigger.color }} />
                {trigger.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Actions (Add Multiple)</h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_ACTIONS.map(action => (
              <Button
                key={action.id}
                size="sm"
                variant="outline"
                onClick={() => addAction(action.id)}
                className="border-border/50 hover:border-primary/50"
                style={{ borderColor: action.color + "40" }}
              >
                <action.icon className="w-4 h-4 mr-2" style={{ color: action.color }} />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Canvas */}
      <Card 
        ref={canvasRef}
        className="relative bg-[oklch(0.12_0.02_240)] border-border/50 overflow-hidden"
        style={{ 
          height: "400px",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(200,200,220,0.1) 1px, transparent 0)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 100;
            const y1 = fromNode.y + 40;
            const x2 = toNode.x;
            const y2 = toNode.y + 40;

            return (
              <g key={idx}>
                <defs>
                  <linearGradient id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "rgba(200,200,220,0.6)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "rgba(180,180,200,0.4)", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={`url(#gradient-${idx})`}
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="rgba(200,200,220,0.6)" />
            </marker>
          </defs>
        </svg>

        {/* Workflow Nodes */}
        {nodes.map(node => {
          const toolInfo = node.type === "trigger" 
            ? AVAILABLE_TRIGGERS.find(t => t.id === node.tool)
            : AVAILABLE_ACTIONS.find(a => a.id === node.tool);

          return (
            <div
              key={node.id}
              className="absolute cursor-move"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                zIndex: 2
              }}
              draggable
              onDragStart={(e) => {
                handleNodeDragStart(node.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDrag={(e) => {
                if (e.clientX === 0 && e.clientY === 0) return; // Ignore end drag event
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  const deltaX = e.clientX - rect.left - node.x - 50;
                  const deltaY = e.clientY - rect.top - node.y - 40;
                  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    handleNodeDrag(node.id, deltaX, deltaY);
                  }
                }
              }}
            >
              <Card 
                className={`p-4 w-[200px] border-2 transition-all ${
                  selectedNode === node.id 
                    ? "border-primary shadow-lg shadow-primary/20" 
                    : "border-border/50 hover:border-border"
                }`}
                style={{
                  background: node.type === "trigger" 
                    ? "linear-gradient(135deg, rgba(200,200,220,0.15) 0%, rgba(180,180,200,0.1) 100%)"
                    : "linear-gradient(135deg, rgba(180,180,200,0.1) 0%, rgba(160,160,180,0.05) 100%)",
                  borderColor: toolInfo?.color + "60"
                }}
                onClick={() => setSelectedNode(node.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {node.icon && <node.icon className="w-5 h-5" style={{ color: toolInfo?.color }} />}
                    <span className="text-sm font-semibold text-gray-200">{node.label}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  {node.type === "trigger" ? "Trigger" : "Action"}
                </div>
              </Card>
            </div>
          );
        })}

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Add triggers and actions above to build your workflow</p>
            </div>
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setNodes([]);
            setConnections([]);
          }}
        >
          Clear Canvas
        </Button>
        <Button
          onClick={handleSave}
          disabled={nodes.length === 0}
          className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Save Workflow
        </Button>
      </div>
    </div>
  );
}
