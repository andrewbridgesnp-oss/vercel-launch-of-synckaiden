import { useState } from "react";
import { TopBar } from "./components/top-bar";
import { SidebarNav } from "./components/sidebar-nav";
import { Overview } from "./views/overview";
import { Leads } from "./views/leads";
import { Campaigns } from "./views/campaigns";
import { ContentEngine } from "./views/content-engine";
import { Automations } from "./views/automations";
import { Analytics } from "./views/analytics";
import { CRM } from "./views/crm";
import { Integrations } from "./views/integrations";
import { Marketplace } from "./views/marketplace";
import { Settings } from "./views/settings";
import { Menu, X } from "lucide-react";
import { Button } from "./components/ui/button";

export default function App() {
  const [activeView, setActiveView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <Overview />;
      case "leads":
        return <Leads />;
      case "campaigns":
        return <Campaigns />;
      case "content":
        return <ContentEngine />;
      case "automations":
        return <Automations />;
      case "analytics":
        return <Analytics />;
      case "crm":
        return <CRM />;
      case "integrations":
        return <Integrations />;
      case "marketplace":
        return <Marketplace />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNnoiIHN0cm9rZT0icmdiYSgyMDAsMjA4LDIxNiwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Top Bar */}
        <TopBar
          onNewCampaign={() => setActiveView("campaigns")}
          onNewContent={() => setActiveView("content")}
        />

        <div className="flex">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-0 left-0 z-50 h-screen w-72
              bg-[rgba(15,23,42,0.95)] backdrop-blur-xl border-r border-border
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <div className="p-4 border-b border-border lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              <SidebarNav
                activeView={activeView}
                onViewChange={(view) => {
                  setActiveView(view);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            {/* Mobile Menu Button */}
            <div className="lg:hidden sticky top-0 z-30 bg-[rgba(15,23,42,0.6)] backdrop-blur-xl border-b border-border p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Content Area */}
            <div className="p-6 lg:p-8 max-w-[1920px] mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}