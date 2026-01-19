import { useEffect, useRef } from "react";

export function MobiusLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const drawMobiusStrip = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw clock face background
      ctx.save();
      ctx.translate(centerX, centerY);

      // Clock circle with glow
      const gradient = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.1)");
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

        ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
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
      const stripWidth = 40;

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
        const hue = 190 + (z1 / stripWidth) * 10; // Cyan to blue

        // Create metallic gradient
        const segmentGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        segmentGradient.addColorStop(0, `hsla(${hue}, 85%, ${40 + brightness * 20}%, 0.9)`);
        segmentGradient.addColorStop(0.5, `hsla(${hue}, 90%, ${60 + brightness * 15}%, 1)`);
        segmentGradient.addColorStop(1, `hsla(${hue}, 85%, ${40 + brightness * 20}%, 0.9)`);

        ctx.strokeStyle = segmentGradient;
        ctx.lineWidth = stripWidth / 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Add shadow for depth
        ctx.shadowColor = "rgba(6, 182, 212, 0.5)";
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();

      // Draw "KAYDEN" text in center with glow
      ctx.save();
      ctx.translate(centerX, centerY);

      ctx.font = "bold 48px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Text glow
      ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
      ctx.shadowBlur = 20;

      // Metallic text gradient
      const textGradient = ctx.createLinearGradient(0, -24, 0, 24);
      textGradient.addColorStop(0, "#06b6d4");
      textGradient.addColorStop(0.5, "#67e8f9");
      textGradient.addColorStop(1, "#0891b2");

      ctx.fillStyle = textGradient;
      ctx.fillText("KAYDEN", 0, 0);

      // Text outline
      ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
      ctx.lineWidth = 1;
      ctx.strokeText("KAYDEN", 0, 0);

      ctx.restore();

      rotation += 0.01;
      animationId = requestAnimationFrame(drawMobiusStrip);
    };

    // Set canvas size
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
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
