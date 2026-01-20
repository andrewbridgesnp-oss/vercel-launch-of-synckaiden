import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Toaster } from "./components/ui/sonner"

// Pages
import { MarketingPage } from "./pages/marketing"
import MarketingLive from "./pages/MarketingLive"
import MarketingLuxury from "./pages/MarketingLuxury"
import { PricingPage } from "./pages/pricing"
import { AuthPage } from "./pages/auth"
import { OnboardingPage } from "./pages/onboarding"
import { DashboardPage } from "./pages/dashboard"
import { CallsPage } from "./pages/calls"
import { BookingsPage } from "./pages/bookings"
import { SettingsPage } from "./pages/settings"
import { CallFlowPage } from "./pages/call-flow"
import { DemoPage } from "./pages/demo"
import InteractiveDemo from "./pages/InteractiveDemo"
import VoiceCloning from "./pages/VoiceCloning"
import PersonalityEngine from "./pages/PersonalityEngine"
import VisualAI from "./pages/VisualAI"
import { LegalPage } from "./pages/legal"
import { InvestorPage } from "./pages/investor"
import { QAControlPage } from "./pages/qa-control"
import { DevHandoffPage } from "./pages/dev-handoff"
import { ContactPage } from "./pages/contact"

type Page =
  | "marketing"
  | "marketing-live"
  | "marketing-luxury"
  | "pricing"
  | "auth"
  | "auth-signup"
  | "onboarding"
  | "dashboard"
  | "calls"
  | "bookings"
  | "settings"
  | "call-flow"
  | "demo"
  | "interactive-demo"
  | "voice-cloning"
  | "personality-engine"
  | "visual-ai"
  | "legal"
  | "investor"
  | "qa"
  | "dev-handoff"
  | "contact"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("marketing-luxury")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [featuresOpen, setFeaturesOpen] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const navigate = (page: Page) => {
    if (page === "auth-signup") {
      setAuthMode("signup")
      setCurrentPage("auth")
    } else if (page === "auth") {
      setAuthMode("signin")
      setCurrentPage("auth")
    } else {
      setCurrentPage(page)
    }
    setMobileMenuOpen(false)
    setFeaturesOpen(false)

    if (page === "dashboard" || page === "calls" || page === "bookings" || page === "settings") {
      setIsAuthenticated(true)
    }

    if (page === "marketing" || page === "pricing") {
      setIsAuthenticated(false)
    }

    window.scrollTo(0, 0)
  }

  const topFeatures = [
    { label: "Voice Clone", description: "Sounds exactly like you", page: "voice-cloning" as Page },
    { label: "Personality Match", description: "Matches your brand", page: "personality-engine" as Page },
    { label: "Smart Booking", description: "Seamless scheduling", page: "bookings" as Page },
  ]

  const bonusFeatures = [
    { label: "SMS & RCS", description: "Multimedia messaging" },
    { label: "Multi-Call", description: "Handle 3 calls at once" },
    { label: "AI Insights", description: "Real-time analysis" },
  ]

  const appNavItems = [
    { label: "Dashboard", page: "dashboard" as Page },
    { label: "Calls", page: "calls" as Page },
    { label: "Bookings", page: "bookings" as Page },
    { label: "Settings", page: "settings" as Page },
  ]

  return (
    <div className="min-h-screen bg-black text-foreground">
      {!["auth", "onboarding"].includes(currentPage) && (
        <nav className="sticky top-0 z-50 liquid-glass">
          <div className="container mx-auto px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo - 4D Rose Gold Text */}
              <button
                onClick={() => navigate(isAuthenticated ? "dashboard" : "marketing-luxury")}
                className="hover:opacity-90 transition-opacity"
              >
                <span className="text-4d-rose-gold text-2xl tracking-[0.4em] uppercase font-light">Avery</span>
              </button>

              {/* Center Navigation */}
              <div className="hidden lg:flex items-center justify-center flex-1">
                {!isAuthenticated ? (
                  <div className="flex items-center gap-16">
                    {/* Features Dropdown */}
                    <div
                      className="relative"
                      onMouseEnter={() => setFeaturesOpen(true)}
                      onMouseLeave={() => setFeaturesOpen(false)}
                    >
                      <button className={`nav-link-4d flex items-center gap-2 ${featuresOpen ? "active" : ""}`}>
                        Features
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-300 ${featuresOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {featuresOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-6 w-72 rounded-2xl overflow-hidden liquid-glass-dropdown">
                          <div className="p-6">
                            <p className="text-[10px] font-medium tracking-[0.3em] uppercase mb-5 text-4d-rose-gold">
                              Core Features
                            </p>
                            <div className="space-y-3">
                              {topFeatures.map((feature) => (
                                <button
                                  key={feature.label}
                                  className="block w-full text-left p-3 rounded-xl transition-all hover:bg-white/5 group"
                                  onClick={() => navigate(feature.page)}
                                >
                                  <p className="text-xs font-medium tracking-wide text-[#d0d0d0] group-hover:text-[#e8b4b8] transition-colors">
                                    {feature.label}
                                  </p>
                                  <p className="text-[10px] mt-1 text-[#505050]">{feature.description}</p>
                                </button>
                              ))}
                            </div>

                            <div className="border-t border-[#b76e79]/10 mt-5 pt-5">
                              <p className="text-[10px] font-medium tracking-[0.3em] uppercase mb-4 text-[#505050]">
                                Additional
                              </p>
                              <div className="space-y-2">
                                {bonusFeatures.map((feature) => (
                                  <div
                                    key={feature.label}
                                    className="p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5"
                                  >
                                    <span className="text-[11px] tracking-wide text-[#606060]">{feature.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigate("pricing")}
                      className={`nav-link-4d ${currentPage === "pricing" ? "active" : ""}`}
                    >
                      Pricing
                    </button>

                    <button
                      onClick={() => navigate("contact")}
                      className={`nav-link-4d ${currentPage === "contact" ? "active" : ""}`}
                    >
                      Contact
                    </button>

                    <button
                      onClick={() => navigate("demo")}
                      className={`nav-link-4d ${currentPage === "demo" ? "active" : ""}`}
                    >
                      Demo
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-12">
                    {appNavItems.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => navigate(item.page)}
                        className={`nav-link-4d ${currentPage === item.page ? "active" : ""}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side - Auth Buttons */}
              <div className="hidden lg:flex items-center gap-8">
                {!isAuthenticated && (
                  <>
                    <button onClick={() => navigate("auth")} className="nav-link-4d">
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate("auth-signup")}
                      className="btn-4d-rose-gold text-xs px-6 py-2.5 rounded-full"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-[#b76e79]">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden py-6 space-y-4 border-t border-[#b76e79]/10">
                {!isAuthenticated ? (
                  <>
                    <div className="space-y-2">
                      {topFeatures.map((feature) => (
                        <button
                          key={feature.label}
                          onClick={() => navigate(feature.page)}
                          className="block w-full text-left px-4 py-3 text-sm tracking-wide text-[#a0a0a0] hover:text-[#e8b4b8] hover:bg-white/5 rounded-xl transition-all"
                        >
                          {feature.label}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[#b76e79]/10 pt-4 space-y-2">
                      <button
                        onClick={() => navigate("pricing")}
                        className="block w-full text-left px-4 py-3 text-sm tracking-wide text-[#a0a0a0] hover:text-[#e8b4b8] hover:bg-white/5 rounded-xl transition-all"
                      >
                        Pricing
                      </button>
                      <button
                        onClick={() => navigate("contact")}
                        className="block w-full text-left px-4 py-3 text-sm tracking-wide text-[#a0a0a0] hover:text-[#e8b4b8] hover:bg-white/5 rounded-xl transition-all"
                      >
                        Contact
                      </button>
                      <button
                        onClick={() => navigate("demo")}
                        className="block w-full text-left px-4 py-3 text-sm tracking-wide text-[#a0a0a0] hover:text-[#e8b4b8] hover:bg-white/5 rounded-xl transition-all"
                      >
                        Demo
                      </button>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => navigate("auth")}
                        className="flex-1 btn-4d-silver-outline text-xs py-3 rounded-full"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate("auth-signup")}
                        className="flex-1 btn-4d-rose-gold text-xs py-3 rounded-full"
                      >
                        Sign Up
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {appNavItems.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => navigate(item.page)}
                        className={`block w-full text-left px-4 py-3 text-sm tracking-wide rounded-xl transition-all ${
                          currentPage === item.page
                            ? "text-[#e8b4b8] bg-white/5"
                            : "text-[#a0a0a0] hover:text-[#e8b4b8] hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main>
        {currentPage === "marketing" && <MarketingPage navigate={navigate} />}
        {currentPage === "marketing-live" && <MarketingLive navigate={navigate} />}
        {currentPage === "marketing-luxury" && <MarketingLuxury navigate={navigate} />}
        {currentPage === "pricing" && <PricingPage navigate={navigate} />}
        {currentPage === "auth" && (
          <AuthPage mode={authMode} navigate={navigate} onLogin={() => navigate("dashboard")} />
        )}
        {currentPage === "onboarding" && <OnboardingPage navigate={navigate} />}
        {currentPage === "dashboard" && <DashboardPage navigate={navigate} />}
        {currentPage === "calls" && <CallsPage navigate={navigate} />}
        {currentPage === "bookings" && <BookingsPage navigate={navigate} />}
        {currentPage === "settings" && <SettingsPage navigate={navigate} />}
        {currentPage === "call-flow" && <CallFlowPage navigate={navigate} />}
        {currentPage === "demo" && <DemoPage navigate={navigate} />}
        {currentPage === "interactive-demo" && <InteractiveDemo navigate={navigate} />}
        {currentPage === "voice-cloning" && <VoiceCloning navigate={navigate} />}
        {currentPage === "personality-engine" && <PersonalityEngine navigate={navigate} />}
        {currentPage === "visual-ai" && <VisualAI navigate={navigate} />}
        {currentPage === "legal" && <LegalPage navigate={navigate} />}
        {currentPage === "investor" && <InvestorPage navigate={navigate} />}
        {currentPage === "qa" && <QAControlPage navigate={navigate} />}
        {currentPage === "dev-handoff" && <DevHandoffPage navigate={navigate} />}
        {currentPage === "contact" && <ContactPage navigate={navigate} />}
      </main>

      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
