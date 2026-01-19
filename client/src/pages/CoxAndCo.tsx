import { Link } from "wouter";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CoxAndCo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                ← Back to Synckaiden
              </Button>
            </Link>
            <div className="flex items-center gap-6">
              <a href="tel:7065513304" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(706) 551-3304</span>
              </a>
              <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-slate-800/50 border border-slate-700 rounded-full mb-8">
              <span className="text-amber-500 font-semibold">Licensed & Insured • Over 30 Years Experience</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Premium Professional Services
            </h1>
            <p className="text-2xl text-slate-300 mb-4">Precision. Excellence. Delivered.</p>
            <p className="text-lg text-slate-400 mb-12">
              With over 30 years of dedicated expertise, Cox&Co delivers unmatched craftsmanship and professional service for every residential and commercial project.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg px-8">
                Get Free Quote <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-500 mb-2">30+</div>
              <div className="text-slate-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-500 mb-2">500+</div>
              <div className="text-slate-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-500 mb-2">100%</div>
              <div className="text-slate-400">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Painting", icon: "🎨", desc: "Interior & exterior painting with premium finishes" },
              { name: "Flooring", icon: "🏠", desc: "Hardwood, tile, laminate, and carpet installation" },
              { name: "Remodeling", icon: "🔨", desc: "Complete home and commercial renovations" },
              { name: "Carpentry", icon: "🪚", desc: "Custom woodwork and finish carpentry" },
              { name: "General Contracting", icon: "👷", desc: "Full-service construction management" },
              { name: "Consulting", icon: "💼", desc: "Expert guidance for your next project" }
            ].map((service) => (
              <div key={service.name} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-amber-500/50 transition">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-slate-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">Get In Touch</h2>
            <div className="space-y-4">
              <a href="tel:7065513304" className="flex items-center justify-center gap-3 text-lg text-slate-300 hover:text-amber-500 transition">
                <Phone className="w-5 h-5" />
                <span>(706) 551-3304</span>
              </a>
              <a href="mailto:coxsprofessionllc@gmail.com" className="flex items-center justify-center gap-3 text-lg text-slate-300 hover:text-amber-500 transition">
                <Mail className="w-5 h-5" />
                <span>coxsprofessionllc@gmail.com</span>
              </a>
              <div className="flex items-center justify-center gap-3 text-lg text-slate-400">
                <MapPin className="w-5 h-5" />
                <span>Greater CSRA and Surrounding Areas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 Cox&Co Professional Services, LLC. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Legal Disclaimers</a>
          </div>
          <p className="mt-4 text-amber-600">Website hosted by Kaiden Builds</p>
        </div>
      </footer>
    </div>
  );
}
