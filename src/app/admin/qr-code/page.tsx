"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export default function QrCodePage() {
  const [url, setUrl] = useState("https://neyork-cafe-restaurant-restaurant-a.vercel.app/menu");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 512,
        margin: 2,
        color: {
          dark: "#16130f", // your nyc-base, reads as premium black instead of default pure black
          light: "#f3ecdd", // your nyc-cream, matches brand instead of stark white
        },
        errorCorrectionLevel: "H", // highest error correction - still scans fine if the printed code gets a little worn/dirty
      }).catch(console.error);
    }
  }, [url]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "nyc-menu-qr-code.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Menu QR Code</h1>

      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Menu URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input w-full"
            placeholder="https://new-york-cafe-restaurant.vercel.app/menu"
          />
        </div>

        <div className="border border-neutral-800 rounded-lg p-6 flex flex-col items-center gap-4 bg-neutral-900">
          <canvas ref={canvasRef} className="rounded-md" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 transition"
          >
            <Download size={16} />
            Download PNG
          </button>
        </div>

        <p className="text-neutral-500 text-xs">
          This downloads a 512×512 PNG suitable for printing on table tents, stickers, or menu cards. High
          error-correction is enabled, so it still scans reliably even if the print gets slightly worn or
          smudged.
        </p>
      </div>
    </div>
  );
}