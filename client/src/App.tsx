import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AppDetail from "./pages/AppDetail";
import BougieBoutique from "./pages/BougieBoutique";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import AveryAI from "./pages/apps/AveryAI";
import TaxApp from "./pages/apps/TaxApp";
import AIFunding from "./pages/apps/AIFunding";
import AtlasAcademy from "./pages/apps/AtlasAcademy";
import VitalSync from "./pages/apps/VitalSync";
import SocialMediaAutopilot from "./pages/apps/SocialMediaAutopilot";
import AgentSwarm from "./pages/apps/AgentSwarm";
import PantryInventory from "./pages/apps/PantryInventory";
import AudioMastering from "./pages/apps/AudioMastering";
import HealthSyncScribe from "./pages/apps/HealthSyncScribe";
import SpamSlayer from "./pages/apps/SpamSlayer";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/app/:slug"} component={AppDetail} />
      <Route path={"/boutique"} component={BougieBoutique} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/order-success"} component={OrderSuccess} />
      <Route path={"/apps/avery-ai"} component={AveryAI} />
      <Route path={"/apps/tax"} component={TaxApp} />
      <Route path={"/apps/ai-funding"} component={AIFunding} />
      <Route path={"/apps/atlas-academy"} component={AtlasAcademy} />
      <Route path={"/apps/vitalsync"} component={VitalSync} />
      <Route path={"/apps/social-media"} component={SocialMediaAutopilot} />
      <Route path={"/apps/agent-swarm"} component={AgentSwarm} />
      <Route path={"/apps/pantry"} component={PantryInventory} />
      <Route path={"/apps/audio-mastering"} component={AudioMastering} />
      <Route path={"/apps/healthsync-scribe"} component={HealthSyncScribe} />
      <Route path={"/apps/spam-slayer"} component={SpamSlayer} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
