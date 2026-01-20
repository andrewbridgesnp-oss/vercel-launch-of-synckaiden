import type React from "react"

import { useState } from "react"
import { Send, MessageSquare, Mail, Phone, MapPin, Bot } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { toast } from "sonner"

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate sending message to Kaiden AI
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success("Message sent to Kaiden!", {
      description: "Our AI assistant will respond to you shortly.",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
            style={{
              background: "rgba(183, 110, 121, 0.1)",
              border: "1px solid rgba(183, 110, 121, 0.3)",
            }}
          >
            <Bot className="w-4 h-4" style={{ color: "#b76e79" }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: "#e8b4b8" }}>
              Powered by Kaiden AI
            </span>
          </div>
          <h1
            className="text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Inter', 'SF Pro Display', sans-serif",
              letterSpacing: "0.02em",
              background: "linear-gradient(135deg, #e8b4b8 0%, #b76e79 50%, #d4a373 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contact Us
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#808080" }}>
            Have questions about Avery? Send a message directly to Kaiden, our AI assistant who manages the entire
            platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form - Liquid Glass Style */}
          <div
            className="p-8 rounded-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(15, 15, 15, 0.95) 0%, rgba(8, 8, 8, 0.98) 100%)",
              border: "1px solid rgba(183, 110, 121, 0.15)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #b76e79 0%, #d4a373 100%)",
                  boxShadow: "0 4px 15px rgba(183, 110, 121, 0.3)",
                }}
              >
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#e8e8e8", letterSpacing: "0.02em" }}>
                  Send a Message
                </h2>
                <p className="text-sm" style={{ color: "#707070" }}>
                  Kaiden will respond within minutes
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: "#c0c0c0" }}>
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-black/50 border-white/10 focus:border-[#b76e79] text-white placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#c0c0c0" }}>
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="bg-black/50 border-white/10 focus:border-[#b76e79] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: "#c0c0c0" }}>
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="bg-black/50 border-white/10 focus:border-[#b76e79] text-white placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: "#c0c0c0" }}>
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-black/50 border-white/10 focus:border-[#b76e79] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "#c0c0c0" }}>
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  required
                  className="bg-black/50 border-white/10 focus:border-[#b76e79] text-white placeholder:text-gray-600 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold py-6 text-black"
                style={{
                  background: "linear-gradient(135deg, #b76e79 0%, #d4a373 50%, #e8b4b8 100%)",
                  boxShadow: "0 4px 20px rgba(183, 110, 121, 0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Sending to Kaiden...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message to Kaiden
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Kaiden Info */}
          <div className="space-y-6">
            {/* Kaiden AI Card with Image */}
            <div
              className="p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(15, 15, 15, 0.95) 0%, rgba(8, 8, 8, 0.98) 100%)",
                border: "1px solid rgba(183, 110, 121, 0.15)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#b76e79]/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="/images/chatgpt-20image-20jan-2015-2c-202026-2c-2012-32-13-20am.png"
                    alt="Kaiden AI"
                    className="w-20 h-20 rounded-2xl object-cover"
                    style={{
                      boxShadow: "0 8px 25px rgba(183, 110, 121, 0.3)",
                    }}
                  />
                  <div>
                    <h3
                      className="text-2xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #e8b4b8 0%, #d4a373 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Meet Kaiden
                    </h3>
                    <p style={{ color: "#b76e79" }}>Your AI Platform Manager</p>
                  </div>
                </div>
                <p className="mb-4" style={{ color: "#808080" }}>
                  Kaiden is our advanced AI assistant that manages the entire Avery platform. When you send a message,
                  Kaiden will:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2" style={{ color: "#c0c0c0" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#b76e79" }} />
                    Analyze your inquiry instantly
                  </li>
                  <li className="flex items-center gap-2" style={{ color: "#c0c0c0" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#b76e79" }} />
                    Route to the right team if needed
                  </li>
                  <li className="flex items-center gap-2" style={{ color: "#c0c0c0" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#b76e79" }} />
                    Respond with personalized solutions
                  </li>
                  <li className="flex items-center gap-2" style={{ color: "#c0c0c0" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#b76e79" }} />
                    Follow up to ensure satisfaction
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Details */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(15, 15, 15, 0.95) 0%, rgba(8, 8, 8, 0.98) 100%)",
                border: "1px solid rgba(183, 110, 121, 0.15)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "#e8e8e8", letterSpacing: "0.02em" }}>
                Other Ways to Reach Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(183, 110, 121, 0.1)" }}
                  >
                    <Mail className="w-5 h-5" style={{ color: "#b76e79" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#707070" }}>
                      Email
                    </p>
                    <p className="font-medium" style={{ color: "#c0c0c0" }}>
                      support@salonsano.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(183, 110, 121, 0.1)" }}
                  >
                    <Phone className="w-5 h-5" style={{ color: "#b76e79" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#707070" }}>
                      Phone
                    </p>
                    <p className="font-medium" style={{ color: "#c0c0c0" }}>
                      +1 (888) AVERY-AI
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(183, 110, 121, 0.1)" }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: "#b76e79" }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#707070" }}>
                      Location
                    </p>
                    <p className="font-medium" style={{ color: "#c0c0c0" }}>
                      San Francisco, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(183, 110, 121, 0.05)",
                border: "1px solid rgba(183, 110, 121, 0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="text-sm" style={{ color: "#c0c0c0" }}>
                  <span className="font-semibold" style={{ color: "#e8b4b8" }}>
                    Kaiden is online
                  </span>{" "}
                  — Average response time: 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
