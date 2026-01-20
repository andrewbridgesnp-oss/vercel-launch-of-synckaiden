import {
  LayoutDashboard,
  Users,
  Target,
  Sparkles,
  Zap,
  BarChart3,
  Database,
  Plug,
  ShoppingBag,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "./ui/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Users, label: "Leads", id: "leads" },
  { icon: Target, label: "Campaigns", id: "campaigns" },
  { icon: Sparkles, label: "Content Engine", id: "content" },
  { icon: Zap, label: "Automations", id: "automations" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Database, label: "CRM", id: "crm" },
  { icon: Plug, label: "Integrations", id: "integrations" },
  { icon: ShoppingBag, label: "Marketplace", id: "marketplace" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "group relative overflow-hidden",
              isActive
                ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(192,200,216,0.1)]"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
            )}
            <Icon className={cn("h-5 w-5 shrink-0 relative z-10", isActive && "animate-pulse")} />
            <span className="flex-1 text-left font-medium relative z-10">{item.label}</span>
            {isActive && (
              <ChevronRight className="h-4 w-4 text-primary relative z-10" />
            )}
          </button>
        );
      })}
    </nav>
  );
}