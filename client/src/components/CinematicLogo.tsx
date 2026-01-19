import { useEffect, useRef, useState } from "react";

export function CinematicLogo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<"video" | "mobius" | "text">("video");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // When video ends, transition to Möbius strip
    const handleVideoEnd = () => {
      setOpacity(0);
      setTimeout(() => {
        setStage("mobius");
        setOpacity(1);
        // After 3 seconds of Möbius, transition to text
        setTimeout(() => {
          setOpacity(0);
          setTimeout(() => {
            setStage("text");
            setOpacity(1);
          }, 500);
        }, 3000);
      }, 500);
    };

    video.addEventListener("ended", handleVideoEnd);
    video.play().catch(err => console.log("Video autoplay prevented:", err));

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  useEffect(() => {
    if (stage !== "mobius") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const drawMobiusStrip = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw clock face background
      ctx.save();
      ctx.translate(centerX, centerY);

      // Clock circle with glow
      const gradient = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.15)");
      gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Clock markers
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6 - Math.PI / 2;
        const x1 = Math.cos(angle) * radius * 0.85;
        const y1 = Math.sin(angle) * radius * 0.85;
        const x2 = Math.cos(angle) * radius * 0.95;
        const y2 = Math.sin(angle) * radius * 0.95;

        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();

      // Draw Möbius strip
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const segments = 60;
      const stripWidth = 35;

      for (let i = 0; i < segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        const nextT = ((i + 1) / segments) * Math.PI * 2;

        // Möbius strip parametric equations
        const twist = t / 2;
        const x1 = (radius + stripWidth * Math.cos(twist)) * Math.cos(t);
        const y1 = (radius + stripWidth * Math.cos(twist)) * Math.sin(t);
        const z1 = stripWidth * Math.sin(twist);

        const nextTwist = nextT / 2;
        const x2 = (radius + stripWidth * Math.cos(nextTwist)) * Math.cos(nextT);
        const y2 = (radius + stripWidth * Math.cos(nextTwist)) * Math.sin(nextT);
        const z2 = stripWidth * Math.sin(nextTwist);

        // Calculate lighting based on z-depth
        const brightness = 0.5 + (z1 / stripWidth) * 0.5;
        const hue = 190 + (z1 / stripWidth) * 10;

        // Create metallic gradient
        const segmentGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        segmentGradient.addColorStop(0, `hsla(${hue}, 85%, ${40 + brightness * 20}%, 0.9)`);
        segmentGradient.addColorStop(0.5, `hsla(${hue}, 90%, ${60 + brightness * 15}%, 1)`);
        segmentGradient.addColorStop(1, `hsla(${hue}, 85%, ${40 + brightness * 20}%, 0.9)`);

        ctx.strokeStyle = segmentGradient;
        ctx.lineWidth = stripWidth / 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.shadowColor = "rgba(6, 182, 212, 0.6)";
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();

      rotation += 0.015;
      animationId = requestAnimationFrame(drawMobiusStrip);
    };

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    drawMobiusStrip();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [stage]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Video Stage */}
      {stage === "video" && (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          style={{ 
            opacity,
            transition: "opacity 0.5s ease-in-out"
          }}
          muted
          playsInline
        >
          <source src="/logo-intro.mp4" type="video/mp4" />
        </video>
      )}

      {/* Möbius Strip Stage */}
      {stage === "mobius" && (
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ 
            opacity,
            transition: "opacity 0.5s ease-in-out",
            minHeight: "400px"
          }}
        />
      )}

      {/* Text Stage */}
      {stage === "text" && (
        <div 
          className="text-center"
          style={{ 
            opacity,
            transition: "opacity 0.5s ease-in-out"
          }}
        >
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-pulse">
            SYNDICA SOLUTIONS
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-6"></div>
          <p className="text-3xl text-cyan-300 font-light tracking-wider">
            KAYDEN
          </p>
          <p className="text-xl text-cyan-400/70 mt-2">
            AI Business Consultant
          </p>
        </div>
      )}
    </div>
  );
}
