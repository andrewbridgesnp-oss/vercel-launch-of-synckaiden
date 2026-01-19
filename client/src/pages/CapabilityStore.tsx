import { useEffect, useRef, useState } from "react";
// @ts-ignore
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy } from "lucide-react";

export default function CapabilityStore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code linking to capability store with user session
    const storeUrl = `${window.location.origin}/capabilities?ref=onboard`;

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        storeUrl,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (error: any) => {
          if (error) console.error(error);
          else {
            const url = canvasRef.current?.toDataURL();
            if (url) setQrUrl(url);
          }
        }
      );
    }
  }, []);

  const handleDownload = () => {
    if (qrUrl) {
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = "kaiden-capability-store-qr.png";
      link.click();
    }
  };

  const handleCopy = async () => {
    const storeUrl = `${window.location.origin}/capabilities?ref=onboard`;
    await navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const storeUrl = `${window.location.origin}/capabilities?ref=onboard`;
    if (navigator.share) {
      await navigator.share({
        title: "Kaiden Capability Store",
        text: "Explore 280+ capabilities to power your business",
        url: storeUrl,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900/20 to-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(0,217,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Capability Store
          </h1>
          <p className="text-gray-400 text-lg">
            Scan or share to explore 280+ capabilities
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8 mb-8 backdrop-blur">
          <div className="flex flex-col items-center">
            <canvas ref={canvasRef} className="mb-6" />
            <p className="text-sm text-gray-400 text-center mb-6">
              Scan this QR code to access the Kaiden Capability Store
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)",
                  color: "#000",
                }}
              >
                <Download className="w-4 h-4" />
                Download QR
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  borderColor: "rgba(0,217,255,0.5)",
                  color: "rgba(0,217,255,0.9)",
                }}
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Capabilities Preview */}
        <div className="bg-black/50 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">What's Inside</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "CRM",
              "Finance",
              "Marketing",
              "Operations",
              "Analytics",
              "Workflows",
              "AI Agents",
              "E-Commerce",
              "Legal",
              "Medical",
              "Real Estate",
              "+ 269 more",
            ].map((cap) => (
              <div
                key={cap}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 text-center"
              >
                <p className="text-sm font-medium text-cyan-300">{cap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
