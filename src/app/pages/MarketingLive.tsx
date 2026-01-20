import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Phone,
  Calendar,
  DollarSign,
  MessageCircle,
  Video,
  Mic,
  ArrowRight,
  Play,
  Check,
  Scissors,
  Palette,
  Smile
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface MarketingLiveProps {
  onNavigate: (page: string) => void;
}

export function MarketingLive({ onNavigate }: MarketingLiveProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const features = [
    {
      icon: Mic,
      title: "Sounds Like You",
      description: "Your voice, your personality",
      color: "from-pink-400 to-rose-500"
    },
    {
      icon: Heart,
      title: "Reads Emotions",
      description: "Knows when to soothe or celebrate",
      color: "from-rose-400 to-pink-500"
    },
    {
      icon: Video,
      title: "Shows Your Face",
      description: "Hyper-realistic avatar of YOU",
      color: "from-pink-500 to-fuchsia-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-salon-blush via-white to-salon-cream overflow-hidden">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {i % 3 === 0 ? (
              <Sparkles className="w-4 h-4 text-pink-300" />
            ) : i % 3 === 1 ? (
              <Heart className="w-3 h-3 text-rose-300" />
            ) : (
              <Star className="w-3 h-3 text-gold-400" fill="currentColor" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Hero Section with Video Background Simulation */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-rose-200 to-gold-200" />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-glow rounded-full" />
              <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Your 24/7 Beauty Concierge</span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-rose-500 to-gold-500 bg-clip-text text-transparent leading-tight"
          >
            Never Miss A Client
            <br />
            Ever Again ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Avery is your AI receptionist who sounds like <strong>you</strong>, 
            looks like <strong>you</strong>, and books appointments while you focus on 
            making clients beautiful 💅
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover-lift"
              onClick={() => onNavigate('auth')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 text-lg px-8 py-6 rounded-full hover-lift"
              onClick={() => onNavigate('demo')}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Animated Feature Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: activeFeature === index ? 1.1 : 1,
                  y: activeFeature === index ? -5 : 0,
                }}
                className={`bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 ${
                  activeFeature === index ? 'border-pink-400 shadow-lg' : 'border-pink-200'
                } transition-all`}
              >
                <div className="flex items-center gap-2">
                  <feature.icon className={`w-5 h-5 ${
                    activeFeature === index ? 'text-pink-500' : 'text-pink-400'
                  }`} />
                  <span className={`font-semibold ${
                    activeFeature === index ? 'text-pink-600' : 'text-gray-600'
                  }`}>
                    {feature.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '10,000+', label: 'Salons Trust Avery', icon: Scissors },
              { number: '99.9%', label: 'Uptime Guarantee', icon: Heart },
              { number: '$428K', label: 'Avg Revenue Increase', icon: Sparkles },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-effect rounded-3xl p-8 text-center hover-lift"
              >
                <stat.icon className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video/Interactive Demo Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              See Avery In Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch how Avery handles real salon calls with grace and personality
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video bg-gradient-to-br from-pink-200 to-rose-200 rounded-3xl overflow-hidden shadow-2xl hover-lift cursor-pointer"
            onClick={() => onNavigate('demo')}
          >
            {/* Video Placeholder with Play Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-400/20 to-rose-400/20 backdrop-blur-sm">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="bg-white rounded-full p-8 shadow-2xl"
              >
                <Play className="w-16 h-16 text-pink-500" fill="currentColor" />
              </motion.div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-2xl"
                  animate={{
                    x: [0, Math.random() * 100 - 50, 0],
                    y: [0, Math.random() * 100 - 50, 0],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                  }}
                  style={{
                    left: `${(i * 20) % 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Animated Cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Everything Your Salon Needs 💖
            </h2>
            <p className="text-xl text-gray-600">
              Avery handles the calls so you can handle the clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'Your Voice Clone',
                description: 'Sounds exactly like you - clients think they\'re talking to you personally',
                color: 'from-pink-400 to-rose-400',
              },
              {
                icon: Heart,
                title: 'Emotional Intelligence',
                description: 'Detects mood, de-escalates frustration, uses charm appropriately',
                color: 'from-rose-400 to-pink-500',
              },
              {
                icon: Calendar,
                title: 'Smart Booking',
                description: 'Fills your calendar with perfect appointments while avoiding conflicts',
                color: 'from-pink-500 to-fuchsia-500',
              },
              {
                icon: DollarSign,
                title: 'Upselling AI',
                description: 'Suggests add-ons naturally. +$428K/year average increase',
                color: 'from-fuchsia-500 to-purple-500',
              },
              {
                icon: Video,
                title: 'Video Consultations',
                description: 'Shows clients styles, colors, before/afters via video',
                color: 'from-purple-400 to-pink-400',
              },
              {
                icon: MessageCircle,
                title: 'SMS Follow-ups',
                description: 'Automatic reminders, confirmations, and thank-you messages',
                color: 'from-pink-400 to-rose-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-effect rounded-3xl p-8 hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials with Animations */}
      <section className="py-20 px-6 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              Salon Owners Love Avery 💕
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Martinez',
                salon: 'Glow Beauty Bar',
                quote: 'Avery books 30% more clients and sounds EXACTLY like me. My clients have no idea it\'s AI!',
                image: '👩🏽',
              },
              {
                name: 'Jessica Chen',
                salon: 'Luxe Hair Studio',
                quote: 'I was skeptical but after seeing the avatar... wow. It\'s like having a digital twin!',
                image: '👩🏻',
              },
              {
                name: 'Maya Patel',
                salon: 'Serenity Spa',
                quote: 'The emotional intelligence is insane. Avery de-escalated an angry client better than I could!',
                image: '👩🏾',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-effect rounded-3xl p-8 hover-lift"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.salon}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Simplified and Beautiful */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-4">
              Pricing That Makes Sense ✨
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Start at $9.99/month. Cancel anytime. 14-day free trial.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-effect rounded-3xl p-12 max-w-2xl mx-auto hover:shadow-2xl transition-all"
            >
              <div className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                Most Popular for Salons
              </div>
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
                $49.99
              </div>
              <div className="text-gray-600 mb-8">per month • Elite Plan</div>
              
              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                {[
                  'Your voice clone',
                  'Your avatar (looks like you)',
                  'Emotional intelligence',
                  'Unlimited calls',
                  'Video consultations',
                  'AR product demos',
                  'Revenue optimization',
                  '50+ languages',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg py-6 rounded-2xl shadow-lg hover-lift"
                onClick={() => onNavigate('auth')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Floating with Animation */}
      <section className="py-20 px-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-200 via-rose-200 to-gold-200 opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-16"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-pink-500 mx-auto" />
            </motion.div>

            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Ready to Never Miss a Client?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join 10,000+ salons using Avery to book more appointments, 
              delight more clients, and make more money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover-lift"
                onClick={() => onNavigate('auth')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default MarketingLive;
