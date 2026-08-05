"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="
        w-8 h-8 rounded-full
        flex items-center justify-center
        text-nyc-taupe
        hover:bg-nyc-gold/20
        hover:text-nyc-gold
        transition-all duration-300
      "
      aria-label="Copy address"
    >
      {copied ? (
        <Check size={15} strokeWidth={1.75} />
      ) : (
        <Copy size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}