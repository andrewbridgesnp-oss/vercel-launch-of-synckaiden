import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Main pages
import Home from "./pages/Home";
import PremiumApps from "./pages/PremiumApps";
import PersonalitySync from "./pages/PersonalitySync";
import CoxAndCo from "./pages/CoxAndCo";
import CreativeClashLiveMain from "./pages/CreativeClashLive";
import Dashboard from "./pages/Dashboard";
import DashboardNew from "./pages/DashboardNew";
import AppDetail from "./pages/AppDetail";
import NotFound from "./pages/NotFound";
import Gate8 from "./pages/Gate8";
import SyncedSites from "./pages/SyncedSites";
import MySubscriptions from "./pages/MySubscriptions";
import FreeAIArena from "./pages/FreeAIArena";
import FreeImageGen from "./pages/FreeImageGen";
import FreeDocConverter from "./pages/FreeDocConverter";
import FreeKlingVideo from "./pages/FreeKlingVideo";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import PricingNew from "./pages/PricingNew";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Tour from "./pages/Tour";

// E-commerce
import BougieBoutique from "./pages/BougieBoutique";
import SigmaStrength from "./pages/SigmaStrength";
import WomensCollection from "./pages/WomensCollection";
import HatsCollection from "./pages/HatsCollection";
import StickersCollection from "./pages/StickersCollection";
import Shop from "./pages/Shop";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Marketplace from "./pages/Marketplace";
import Inventory from "./pages/Inventory";

// Subscription & Settings
import Subscription from "./pages/Subscription";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import Settings from "./pages/Settings";
import CapabilityStore from "./pages/CapabilityStore";

// Platform Hubs
import BusinessOperationsHub from "./pages/BusinessOperationsHub";

// Business Apps
import BusinessHub from "./pages/BusinessHub";
import BusinessCommand from "./pages/BusinessCommand";
import BusinessCredit from "./pages/BusinessCredit";
import BusinessTools from "./pages/BusinessTools";
import NewBusinessGuide from "./pages/NewBusinessGuide";
import LLCFormation from "./pages/LLCFormation";
import Employees from "./pages/Employees";
import CostReduction from "./pages/CostReduction";
import SideHustle from "./pages/SideHustle";

// Finance Apps
import FinancialCommandCenter from "./pages/FinancialCommandCenter";
import Finance from "./pages/Finance";
import TaxManagement from "./pages/TaxManagement";
import DynastyTrust from "./pages/DynastyTrust";
import ContractsInvoices from "./pages/ContractsInvoices";

// CRM & Sales
import SalesMarketingHub from "./pages/SalesMarketingHub";
import CRM from "./pages/CRM";
import Sales from "./pages/Sales";
import Leads from "./pages/Leads";

// Marketing
import Marketing from "./pages/Marketing";
import Videos from "./pages/Videos";
import YouTubeChannel from "./pages/YouTubeChannel";
import YouTubeManager from "./pages/YouTubeManager";
import AdsSuite from "./pages/AdsSuite";
import Websites from "./pages/Websites";
import Templates from "./pages/Templates";
import CreativeContentEngine from "./pages/CreativeContentEngine";

// Workflows & Automation
import Workflows from "./pages/Workflows";
import WorkspaceManagement from "./pages/WorkspaceManagement";
import TeamHub from "./pages/TeamHub";
import Integrations from "./pages/Integrations";
import ShopifySettings from "./pages/ShopifySettings";

// AI & Tools
import AIIntelligenceSuite from "./pages/AIIntelligenceSuite";
import Chat from "./pages/Chat";
import AIArena from "./pages/AIArena";
import VoiceAuth from "./pages/VoiceAuth";

// Health & Education
import MedicalBilling from "./pages/MedicalBilling";
import Grants from "./pages/Grants";

// Legal & Professional
import Professionals from "./pages/Professionals";
import VipDirectory from "./pages/VipDirectory";
import VirtualNotary from "./pages/VirtualNotary";

// Productivity
import Scheduler from "./pages/Scheduler";
import Security from "./pages/Security";
import ThreatScan from "./pages/ThreatScan";
import Analytics from "./pages/Analytics";

// Admin & Testing
import Admin from "./pages/Admin";
import ComponentShowcase from "./pages/ComponentShowcase";
import NotificationTest from "./pages/NotificationTest";
import SCProvider from "./pages/SCProvider";
import Tools from "./pages/Tools";

// App-specific pages
import AveryAI from "./pages/apps/AveryAI";
import AveryAIReceptionist from "./pages/apps/AveryAIReceptionist";

import TaxApp from "./pages/apps/TaxApp";
import TaxAssistant from "./pages/TaxAssistant";
import AIFunding from "./pages/apps/AIFunding";
import AtlasAcademy from "./pages/apps/AtlasAcademy";
import VitalSync from "./pages/apps/VitalSync";
// import SocialMediaAutopilot from "./pages/apps/SocialMediaAutopilot"; // TODO: Fix react-router-dom dependency
import AgentSwarm from "./pages/apps/AgentSwarm";
import PantryInventory from "./pages/apps/PantryInventory";
import AudioMastering from "./pages/apps/AudioMastering";
import HealthSyncScribe from "./pages/apps/HealthSyncScribe";
import SpamSlayer from "@/pages/apps/SpamSlayer";
import MarketingOS from "@/pages/apps/MarketingOS";
import CreativeClashLiveApp from "@/pages/apps/CreativeClashLive";
import YouTubeAutomation from "@/pages/apps/YouTubeAutomation";
import LLCFormationApp from "@/pages/apps/LLCFormation";
import AIFundingBrokerage from "./pages/apps/AIFundingBrokerage";
// import FinancialCoPilot from "./pages/apps/FinancialCoPilot"; // TODO: Fix react-router-dom dependency
// import HouseHack from "./pages/apps/HouseHack"; // TODO: Fix react-router-dom dependency
// import PersonalitySync from "./pages/apps/PersonalitySync"; // TODO: Fix react-router-dom dependency
import RealitySync from "./pages/apps/RealitySync";
// import Academy from "./pages/apps/Academy"; // TODO: Fix Academy dependencies (Codex handling)
import Contact from "./pages/Contact";
import RequestApp from "./pages/RequestApp";
import AdminDashboard from "./pages/AdminDashboard";
import SecretsManagement from "./pages/SecretsManagement";
import AppDevelopmentDashboard from "./pages/AppDevelopmentDashboard";

function Router() {
  return (
    <Switch>
      {/* Main routes */}
          <Route path="/" component={Home} />
          <Route path="/premium-apps" component={PremiumApps} />
      <Route path="/gate-8" component={Gate8} />
      <Route path="/synced-sites" component={SyncedSites} />
      <Route path="/my-subscriptions" component={MySubscriptions} />
      <Route path="/free-ai-arena" component={FreeAIArena} />
      <Route path="/free-image-gen" component={FreeImageGen} />
      <Route path="/free-doc-converter" component={FreeDocConverter} />
      <Route path="/free-kling-video" component={FreeKlingVideo} />
      <Route path="/personality-sync" component={PersonalitySync} />
      <Route path="/apps" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard-new" component={DashboardNew} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/pricing-new" component={PricingNew} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
    <Route path="/coxandco" component={CoxAndCo} />
      <Route path="/contact" component={Contact} />
      <Route path="/request-app" component={RequestApp} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/secrets" component={SecretsManagement} />
      <Route path="/admin/app-development" component={AppDevelopmentDashboard} />
      
      {/* E-commerce */}
      <Route path="/boutique" component={BougieBoutique} />
      <Route path="/sigma-strength" component={SigmaStrength} />
      <Route path="/womens-collection" component={WomensCollection} />
      <Route path="/hats-collection" component={HatsCollection} />
      <Route path="/stickers-collection" component={StickersCollection} />
      <Route path="/shop" component={Shop} />
      <Route path="/products" component={Products} />
      <Route path="/orders" component={Orders} />
      <Route path="/order-success" component={OrderSuccess} />
      <Route path="/purchase-success" component={PurchaseSuccess} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/inventory" component={Inventory} />
      
      {/* Subscription & Settings */}
      <Route path="/subscription" component={Subscription} />
      <Route path="/subscription-management" component={SubscriptionManagement} />
      <Route path="/settings" component={Settings} />
      <Route path="/store" component={CapabilityStore} />
      
      {/* Platform Hubs */}
      <Route path="/business-operations-hub" component={BusinessOperationsHub} />
      <Route path="/ai-intelligence-suite" component={AIIntelligenceSuite} />
      
      {/* Business Apps */}
      <Route path="/business" component={BusinessHub} />
      <Route path="/business/receptionist" component={AveryAIReceptionist} />
      <Route path="/business-command" component={BusinessCommand} />
      <Route path="/business-credit" component={BusinessCredit} />
      <Route path="/business-tools" component={BusinessTools} />
      <Route path="/new-business" component={NewBusinessGuide} />
      <Route path="/llc-formation" component={LLCFormation} />
      <Route path="/employees" component={Employees} />
      <Route path="/cost-reduction" component={CostReduction} />
      <Route path="/side-hustle" component={SideHustle} />
      
      {/* Finance Apps */}
      <Route path="/financial-command-center" component={FinancialCommandCenter} />
      <Route path="/finance" component={Finance} />
      <Route path="/tax" component={TaxManagement} />
      <Route path="/dynasty-trust" component={DynastyTrust} />
      <Route path="/contracts" component={ContractsInvoices} />
      
      {/* CRM & Sales */}
      <Route path="/sales-marketing-hub" component={SalesMarketingHub} />
      <Route path="/crm" component={CRM} />
      <Route path="/sales" component={Sales} />
      <Route path="/leads" component={Leads} />
      
      {/* Marketing */}
      <Route path="/marketing" component={Marketing} />
      <Route path="/videos" component={Videos} />
      <Route path="/youtube" component={YouTubeChannel} />
      <Route path="/youtube-manager" component={YouTubeManager} />
      <Route path="/ads" component={AdsSuite} />
      <Route path="/websites" component={Websites} />
      <Route path="/templates" component={Templates} />
      <Route path="/creative-engine" component={CreativeContentEngine} />
      
      {/* Workflows & Automation */}
      <Route path="/workflows" component={Workflows} />
      <Route path="/workspaces" component={WorkspaceManagement} />
      <Route path="/team" component={TeamHub} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/shopify-settings" component={ShopifySettings} />
      
      {/* AI & Tools */}
      <Route path="/chat" component={Chat} />
      <Route path="/ai-arena" component={AIArena} />
      <Route path="/voice-auth" component={VoiceAuth} />
      
      {/* Health & Education */}
      <Route path="/medical-billing" component={MedicalBilling} />
      <Route path="/grants" component={Grants} />
      
      {/* Legal & Professional */}
      <Route path="/professionals" component={Professionals} />
      <Route path="/vip-directory" component={VipDirectory} />
      <Route path="/virtual-notary" component={VirtualNotary} />
      
      {/* Productivity */}
      <Route path="/scheduler" component={Scheduler} />
      <Route path="/security" component={Security} />
      <Route path="/threat-scan" component={ThreatScan} />
      <Route path="/analytics" component={Analytics} />
      
      {/* Admin & Testing */}
      <Route path="/admin" component={Admin} />
      <Route path="/components" component={ComponentShowcase} />
      <Route path="/notification-test" component={NotificationTest} />
      <Route path="/sc-provider" component={SCProvider} />
      <Route path="/tools" component={Tools} />
      
      {/* App detail pages */}
      <Route path="/app/:slug" component={AppDetail} />
      
      {/* Specific app dashboards */}
      <Route path="/apps/avery-ai" component={AveryAI} />
      <Route path="/apps/avery-receptionist" component={AveryAIReceptionist} />
      <Route path="/apps/ai-receptionist" component={AveryAIReceptionist} />

      <Route path="/apps/tax" component={TaxApp} />
      <Route path="/apps/tax-assistant" component={TaxAssistant} />
      <Route path="/apps/ai-funding" component={AIFunding} />
      <Route path="/apps/atlas-academy" component={AtlasAcademy} />
      <Route path="/apps/vitalsync" component={VitalSync} />
      {/* <Route path="/apps/social-media" component={SocialMediaAutopilot} /> */}
      <Route path="/apps/agent-swarm" component={AgentSwarm} />
      <Route path="/apps/pantry" component={PantryInventory} />
      <Route path="/apps/audio-mastering" component={AudioMastering} />
      <Route path="/apps/healthsync-scribe" component={HealthSyncScribe} />
      <Route path="/app/spam-slayer" component={SpamSlayer} />
      <Route path="/app/marketing-os" component={MarketingOS} />
      <Route path="/app/creative-clash-live" component={CreativeClashLiveApp} />
      <Route path="/creative-clash" component={CreativeClashLiveMain} />
      <Route path="/apps/youtube" component={YouTubeAutomation} />
      <Route path="/apps/llc-formation" component={LLCFormationApp} />
      <Route path="/apps/ai-funding-brokerage" component={AIFundingBrokerage} />
      {/* <Route path="/apps/financial-copilot" component={FinancialCoPilot} /> */}
      {/* <Route path="/apps/house-hack" component={HouseHack} /> */}
      {/* <Route path="/apps/personality-sync" component={PersonalitySync} /> */}
      <Route path="/apps/reality-sync" component={RealitySync} />
      {/* <Route path="/apps/academy" component={Academy} /> */}
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
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
