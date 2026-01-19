import { useEffect, useRef, useState } from "react";

export function TimelessLogoAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentText, setCurrentText] = useState<"KAYDENAI" | "SYNDICA">("KAYDENAI");
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    let animationFrame: number;
    let time = 0;
    const CYCLE_DURATION = 8000; // 8 seconds per full cycle
    const TRANSITION_DURATION = 1500; // 1.5 seconds for text transition

    const drawMobiusStrip = (t: number, alpha: number) => {
      const centerX = canvas.width / 2 / (window.devicePixelRatio || 1);
      const centerY = canvas.height / 2 / (window.devicePixelRatio || 1);
      const radius = 80;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(centerX, centerY);
      ctx.rotate(t * 0.5);

      // Draw Möbius strip with metallic silver gradient
      const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
      gradient.addColorStop(0, "rgba(200, 200, 220, 0.9)");
      gradient.addColorStop(0.5, "rgba(240, 240, 255, 1)");
      gradient.addColorStop(1, "rgba(180, 180, 200, 0.8)");

      // Draw twisted ribbon
      for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const twist = Math.sin(angle * 2 + t * 2) * 0.3;
        
        const x1 = Math.cos(angle) * radius;
        const y1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle) * (radius + 20);
        const y2 = Math.sin(angle) * (radius + 20);

        ctx.beginPath();
        ctx.moveTo(x1, y1 + twist * 20);
        ctx.lineTo(x2, y2 - twist * 20);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawClock = (t: number, alpha: number) => {
      const centerX = canvas.width / 2 / (window.devicePixelRatio || 1);
      const centerY = canvas.height / 2 / (window.devicePixelRatio || 1);
      const radius = 60;

      ctx.save();
      ctx.globalAlpha = alpha * 0.6;
      ctx.translate(centerX, centerY);

      // Clock face with silver gradient
      const faceGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      faceGradient.addColorStop(0, "rgba(220, 220, 230, 0.3)");
      faceGradient.addColorStop(1, "rgba(180, 180, 200, 0.1)");
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = faceGradient;
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 200, 220, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hour markers
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = Math.cos(angle) * (radius - 10);
        const y1 = Math.sin(angle) * (radius - 10);
        const x2 = Math.cos(angle) * (radius - 5);
        const y2 = Math.sin(angle) * (radius - 5);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(200, 200, 220, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Clock hands - moving back and forth (timeless effect)
      const hourAngle = Math.sin(t) * 0.5; // Oscillates instead of progressing
      const minuteAngle = Math.sin(t * 2) * 0.8;

      // Hour hand
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(hourAngle) * (radius - 25), Math.sin(hourAngle) * (radius - 25));
      ctx.strokeStyle = "rgba(220, 220, 240, 0.9)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Minute hand
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(minuteAngle) * (radius - 15), Math.sin(minuteAngle) * (radius - 15));
      ctx.strokeStyle = "rgba(200, 200, 230, 0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240, 240, 255, 1)";
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      time += 16; // ~60fps
      const t = (time % CYCLE_DURATION) / 1000;
      const cycleProgress = (time % CYCLE_DURATION) / CYCLE_DURATION;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Möbius strip and clock
      const elementAlpha = Math.sin(t * 0.5) * 0.3 + 0.7; // Pulsing effect
      drawMobiusStrip(t, elementAlpha);
      drawClock(t, elementAlpha);

      // Determine which text to show based on cycle
      const isTransitioning = cycleProgress > 0.4 && cycleProgress < 0.6;
      if (cycleProgress < 0.5 && currentText !== "KAYDENAI") {
        setCurrentText("KAYDENAI");
      } else if (cycleProgress >= 0.5 && currentText !== "SYNDICA") {
        setCurrentText("SYNDICA");
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateSize);
    };
  }, [currentText]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Canvas for Möbius strip and clock */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      
      {/* Text overlay with smooth transitions */}
      <div className="relative z-10 text-center">
        <div className="relative h-32">
          {/* KAYDENAI */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1500 ${
              currentText === "KAYDENAI"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <h1 className="text-7xl font-bold tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #e0e0e8 0%, #ffffff 50%, #c0c0d0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 40px rgba(255,255,255,0.3)",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                }}>
              KAYDENAI
            </h1>
            <p className="text-sm tracking-widest mt-2 text-gray-300">
              AI BUSINESS CONSULTANT
            </p>
          </div>

          {/* SYNDICA SOLUTIONS */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1500 ${
              currentText === "SYNDICA"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <h1 className="text-7xl font-bold tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #d0d0e0 0%, #f0f0ff 50%, #b0b0c8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 40px rgba(255,255,255,0.3)",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                }}>
              SYNDICA
            </h1>
            <p className="text-sm tracking-widest mt-2 text-gray-300">
              SOLUTIONS
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-lg text-gray-400 max-w-2xl mx-auto">
          Where time stands still and innovation never stops
        </p>
      </div>
    </div>
  );
}
