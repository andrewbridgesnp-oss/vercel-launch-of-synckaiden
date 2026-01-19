import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const testimonials = [
  {
    name: "Michael Chen",
    company: "Summit Consulting Group",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    text: "Kaiden saved me 15 hours a week on client follow-ups and scheduling. The automation is seamless and the AI actually understands context.",
  },
  {
    name: "Sarah Martinez",
    company: "Apex Marketing Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    text: "I was skeptical at first, but Kaiden handles my email campaigns and lead tracking better than my previous VA. ROI paid for itself in week one.",
  },
  {
    name: "David Thompson",
    company: "Horizon Financial Services",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    text: "The approval system gives me complete control while automating the tedious stuff. It's like having a junior analyst who never sleeps.",
  },
  {
    name: "Jennifer Park",
    company: "Velocity Tech Solutions",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    text: "Finally, an AI assistant that doesn't feel like a black box. I can see exactly what it's doing and approve critical actions before they happen.",
  },
  {
    name: "Marcus Johnson",
    company: "Pinnacle Investments",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    text: "The CRM integration alone is worth the subscription. Kaiden automatically logs every interaction and reminds me when to follow up.",
  },
  {
    name: "Emily Rodriguez",
    company: "Catalyst Business Partners",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=faces",
    text: "I've tried three other AI tools this year. Kaiden is the only one that actually delivers on its promises without constant babysitting.",
  },
  {
    name: "Robert Kim",
    company: "Nexus Advisory Group",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    text: "The voice interface is game-changing. I can update tasks and check analytics while driving between client meetings.",
  },
  {
    name: "Amanda Foster",
    company: "Elevate Consulting",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    text: "Best investment I've made this year. Kaiden handles my entire lead nurturing sequence and I've seen a 40% increase in conversions.",
  },
];

export function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
              <Card className="glass border-border/50 p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-200">{testimonial.name}</p>
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-400 italic">"{testimonial.text}"</p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
