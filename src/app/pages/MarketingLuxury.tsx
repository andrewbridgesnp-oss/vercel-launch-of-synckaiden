import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Check, ChevronDown } from "lucide-react"
import { Button } from "../components/ui/button"

interface MarketingLuxuryProps {
  onNavigate: (page: string) => void
}

export function MarketingLuxury({ onNavigate }: MarketingLuxuryProps) {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      {/* Minimal Header with Rose Gold Accent */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "liquid-glass shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-12 text-left"></nav>
          <Button
            variant="outline"
            className="btn-4d-silver-outline rounded-full px-8 py-2 bg-transparent"
            onClick={() => onNavigate("auth")}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero - Sophisticated with Rose Gold Accents - 31% lighter */}
      <section className="min-h-screen flex items-center justify-center px-8 pt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#252525]/90 via-[#1f1f1f]/90 to-[#252525]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(183,110,121,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(192,192,192,0.08)_0%,_transparent_50%)]" />

        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#b76e79]/12 via-[#e8b4b8]/6 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[#c0c0c0]/8 via-[#e8e8e8]/5 to-transparent rounded-full blur-[80px]" />

        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#b76e79]/8 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#c0c0c0]/8 to-transparent" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-gradient-to-br from-[#b76e79]/8 via-[#2a2a2a]/90 to-[#c0c0c0]/5 rounded-3xl backdrop-blur-sm border border-[#b76e79]/10" />

            <div className="relative z-10 p-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="relative inline-block">
                  {/* Glow layers behind text */}
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#b76e79]/40 via-[#c0c0c0]/30 to-[#b76e79]/40 -z-10" />

                  {/* Main Logo Text - 4D Hyperrealistic */}
                  <h2 className="text-5xl md:text-7xl font-extralight tracking-[0.4em] uppercase text-4d-rose-gold">
                    Salon Sano
                  </h2>

                  {/* Shine overlay effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-pulse"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tight leading-none">
                <span className="text-4d-silver block mb-2">Your Voice,</span>
                <span className="text-4d-rose-gold italic block">Everywhere</span>
              </h1>

              <p className="text-xl md:text-2xl font-light text-body-silver mb-14 max-w-2xl mx-auto leading-relaxed">
                AI reception that sounds like you, looks like you, and{" "}
                <em className="text-4d-rose-gold not-italic">remembers</em> your clients.
              </p>

              {/* Buttons - Same Row */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button
                  size="lg"
                  className="btn-4d-rose-gold px-10 py-6 text-sm rounded-full"
                  onClick={() => onNavigate("auth")}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-4d-silver-outline px-10 py-6 text-sm rounded-full bg-transparent"
                  onClick={() => onNavigate("demo")}
                >
                  Watch Demo
                </Button>
              </div>

              <p className="text-xs font-light text-body-muted mt-8 tracking-wide">
                14 days free - No credit card - Cancel anytime
              </p>
            </div>
          </motion.div>

          <motion.div style={{ opacity }} className="absolute bottom-16 left-1/2 -translate-x-1/2">
            <ChevronDown className="w-5 h-5 text-[#e8b4b8] animate-gentle-float" />
          </motion.div>
        </div>
      </section>

      {/* 3 KILLER UNIQUE FEATURES */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block glass-rose-gold px-6 py-2.5 rounded-full mb-8">
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-4d-rose-gold">Industry First</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-4d-silver">
              Features No Competitor Has
            </h2>
            <p className="text-lg font-light text-body-muted max-w-2xl mx-auto">
              We didn't just build an AI receptionist. We built the future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-4d rounded-2xl p-10 group"
            >
              <div className="w-20 h-20 rounded-2xl mb-8 group-hover:scale-110 transition-transform overflow-hidden relative">
                <img
                  src="/hyperrealistic-3d-brain-neural-network-glowing-ros.jpg"
                  alt="Emotional Memory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/30 to-transparent" />
              </div>
              <h3 className="text-2xl font-light mb-4 text-4d-silver">Emotional Memory</h3>
              <p className="text-sm font-light text-body-muted leading-relaxed mb-6">
                Avery remembers how each client prefers to be treated. Sarah likes small talk. Jessica wants efficiency.
                David needs reassurance.
              </p>
              <div className="glass-rose-gold px-4 py-2 rounded-full inline-block">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                  Exclusive to Avery
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card-4d rounded-2xl p-10 group"
            >
              <div className="w-20 h-20 rounded-2xl mb-8 group-hover:scale-110 transition-transform overflow-hidden relative">
                <img
                  src="/hyperrealistic-3d-sound-waves-being-cancelled-silv.jpg"
                  alt="Noise Cancellation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/30 to-transparent" />
              </div>
              <h3 className="text-2xl font-light mb-4 text-4d-silver">Noise Cancellation</h3>
              <p className="text-sm font-light text-body-muted leading-relaxed mb-6">
                Salon too loud? Avery intelligently cancels background noise in real-time. Crystal clear conversations,
                even during rush hour.
              </p>
              <div className="glass-rose-gold px-4 py-2 rounded-full inline-block">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                  Exclusive to Avery
                </span>
              </div>
            </motion.div>

            {/* Feature 3: Loyalty Guard with hyperrealistic thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card-4d rounded-2xl p-10 group"
            >
              <div className="w-20 h-20 rounded-2xl mb-8 group-hover:scale-110 transition-transform overflow-hidden relative">
                <img
                  src="/hyperrealistic-3d-shield-with-rose-gold-glow-prote.jpg"
                  alt="Loyalty Guard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/30 to-transparent" />
              </div>
              <h3 className="text-2xl font-light mb-4 text-4d-silver">Loyalty Guard</h3>
              <p className="text-sm font-light text-body-muted leading-relaxed mb-6">
                When clients mention competitors, Avery subtly reinforces your salon's unique value. Protects your
                revenue automatically.
              </p>
              <div className="glass-rose-gold px-4 py-2 rounded-full inline-block">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                  Exclusive to Avery
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Autonomous AI Section */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#c0c0c0]/5 via-transparent to-[#b76e79]/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block glass-rose-gold px-6 py-2.5 rounded-full mb-8">
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-4d-rose-gold">Autonomous AI</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-4d-silver">
              Avery Acts On Her Own
            </h2>
            <p className="text-lg font-light text-body-muted max-w-2xl mx-auto">
              Give her a petty cash account and watch the magic happen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Starbucks Orders */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-4d rounded-2xl p-10 group"
            >
              <div className="w-24 h-24 rounded-2xl mb-8 group-hover:scale-110 transition-transform overflow-hidden relative">
                <img
                  src="/hyperrealistic-3d-premium-coffee-cup-with-steam-ro.jpg"
                  alt="Coffee Orders"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/20 to-transparent" />
              </div>
              <h3 className="text-3xl font-light mb-4 text-4d-silver">Surprise Coffee Runs</h3>
              <p className="text-base font-light text-body-muted leading-relaxed mb-6">
                Busy morning? Avery notices when the salon is slammed and autonomously orders Starbucks for your team.
                She remembers everyone's favorites and times delivery perfectly.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="glass-rose-gold px-4 py-2 rounded-full">
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                    Autonomous Ordering
                  </span>
                </div>
                <div className="glass-rose-gold px-4 py-2 rounded-full">
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                    Petty Cash Enabled
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Birthday Surprises */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card-4d rounded-2xl p-10 group"
            >
              <div className="w-24 h-24 rounded-2xl mb-8 group-hover:scale-110 transition-transform overflow-hidden relative">
                <img
                  src="/hyperrealistic-3d-elegant-gift-box-with-rose-gold-.jpg"
                  alt="Birthday Surprises"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/20 to-transparent" />
              </div>
              <h3 className="text-3xl font-light mb-4 text-4d-silver">Staff Birthday Magic</h3>
              <p className="text-base font-light text-body-muted leading-relaxed mb-6">
                Avery tracks staff birthdays and takes initiative. She orders treats, coordinates surprise deliveries,
                and sends personalized messages. Your team feels valued without you lifting a finger.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="glass-rose-gold px-4 py-2 rounded-full">
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                    Calendar Aware
                  </span>
                </div>
                <div className="glass-rose-gold px-4 py-2 rounded-full">
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-4d-rose-gold">
                    Team Morale
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Autonomous Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 card-4d rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="/hyperrealistic-3d-heart-with-rose-gold-glow-on-bla.jpg"
                    alt="Client Appreciation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-light text-4d-silver mb-2">Client Appreciation</h4>
                  <p className="text-sm text-body-muted">Sends thank-you gifts to loyal clients on milestones</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="/hyperrealistic-3d-calendar-with-sparkles-silver-on.jpg"
                    alt="Context Aware"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-light text-4d-silver mb-2">Context Aware</h4>
                  <p className="text-sm text-body-muted">Knows holidays, seasons, and special occasions</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="/hyperrealistic-3d-sparkle-stars-rose-gold-premium-.jpg"
                    alt="Proactive Care"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-light text-4d-silver mb-2">Proactive Care</h4>
                  <p className="text-sm text-body-muted">Acts before you ask, based on patterns she learns</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats - Rose Gold Accents - 31% lighter */}
      <section className="py-32 px-8 bg-gradient-to-b from-transparent via-[#252525] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { number: "10,000+", label: "Salons & Spas" },
              { number: "99.9%", label: "Uptime" },
              { number: "$428K", label: "Avg. Revenue Lift" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="text-center border-b border-[#b76e79]/20 pb-10"
              >
                <div className="text-5xl md:text-6xl font-light mb-4 text-4d-rose-gold">{stat.number}</div>
                <div className="text-xs font-light uppercase tracking-[0.25em] text-body-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features - Liquid Glass Cards */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-light mb-6 tracking-tight text-4d-silver">Everything You Need</h2>
            <p className="text-lg font-light text-body-muted max-w-2xl mx-auto">
              Professional-grade AI reception for the modern salon
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                image: "/hyperrealistic-3d-microphone-with-rose-gold-accent.jpg",
                title: "Voice Cloning",
                description: "Your actual voice, not generic AI. Clients hear you.",
              },
              {
                image: "/hyperrealistic-3d-holographic-avatar-female-face-r.jpg",
                title: "Visual Presence",
                description: "Hyper-realistic avatar. Show your face, build trust.",
              },
              {
                image: "/hyperrealistic-3d-calendar-with-glowing-appointmen.jpg",
                title: "Intelligent Booking",
                description: "Context-aware scheduling. Maximizes your time.",
              },
              {
                image: "/hyperrealistic-3d-emotional-face-with-empathy-wave.jpg",
                title: "Emotional AI",
                description: "Reads tone, de-escalates stress, maintains your brand.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card-4d rounded-2xl p-8 group"
              >
                <div className="w-16 h-16 rounded-xl mb-6 group-hover:scale-110 transition-transform overflow-hidden relative">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/20 to-transparent" />
                </div>
                <h3 className="text-xl font-light mb-3 text-4d-silver">{feature.title}</h3>
                <p className="text-sm font-light text-body-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Liquid Glass Card */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-4d rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#b76e79]/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#c0c0c0]/15 to-transparent rounded-tr-full" />

            <div className="relative z-10">
              <div className="glass-rose-gold px-6 py-2.5 rounded-full inline-block mb-8">
                <span className="text-xs font-medium tracking-[0.3em] uppercase text-4d-rose-gold">Most Popular</span>
              </div>

              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl md:text-7xl font-light text-4d-rose-gold">$49</span>
                <span className="text-lg font-light text-body-muted">/month</span>
              </div>

              <p className="text-body-muted mb-10">Everything included. No surprises.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
                {["Unlimited Calls", "Voice Clone", "Smart Booking", "Analytics"].map((item) => (
                  <div key={item} className="flex items-center justify-center gap-2 text-sm text-body-silver">
                    <Check className="w-4 h-4 text-[#e8b4b8]" />
                    {item}
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="btn-4d-rose-gold px-12 py-6 text-sm rounded-full"
                onClick={() => onNavigate("auth")}
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-16 px-8 border-t border-[#b76e79]/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-4d-rose-gold text-xl tracking-[0.3em] uppercase font-light">Avery</span>
          <p className="text-xs text-body-muted tracking-wide">2026 Avery AI. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  )
}

export default MarketingLuxury
