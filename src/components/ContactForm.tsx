"use client";

import { useState } from "react";
import { submitContactMessage } from "@/lib/actions/contact";
import { useLanguage } from "@/lib/language-context";

const t = {
  en: {
    name: "Name",
    email: "Email",
    message: "How can we help you today?",
    send: "Send Message",
    sending: "Sending...",
    thanks: "Thank you! We've received your message and will get back to you soon.",
    error: "Something went wrong. Please try again.",
  },
  am: {
    name: "ስም",
    email: "ኢሜይል",
    message: "ዛሬ እንዴት ልንረዳዎት እንችላለን?",
    send: "መልእክት ላክ",
    sending: "በመላክ ላይ...",
    thanks: "እናመሰግናለን! መልእክትዎ ደርሶናል፣ በቅርቡ እንመልስልዎታለን።",
    error: "የሆነ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
  },
};

export default function ContactForm() {
  const { lang } = useLanguage();
  const tr = t[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const result = await submitContactMessage({ name, email, message });
    if (result.success) {
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
        
   <div className="bg-nyc-gold/10 border border-nyc-gold/20 rounded-[32px] p-8 text-center">
        <p className="text-nyc-gold-light">{tr.thanks}</p>
      </div>
    );
  }

  return (
  
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={tr.name}
        required
className="w-full px-4 py-3 rounded-md bg-white dark:bg-nyc-base border border-nyc-gold/20 text-nyc-base dark:text-nyc-cream placeholder:text-nyc-taupe focus:outline-none focus:border-nyc-gold"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={tr.email}
        required
        className="w-full px-4 py-3 rounded-md bg-white dark:bg-nyc-base border border-nyc-gold/20 text-nyc-base dark:text-nyc-cream placeholder:text-nyc-taupe focus:outline-none focus:border-nyc-gold"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={tr.message}
        required
        rows={4}
className="w-full px-4 py-3 rounded-md bg-white dark:bg-nyc-base border border-nyc-gold/20 text-nyc-base dark:text-nyc-cream placeholder:text-nyc-taupe focus:outline-none focus:border-nyc-gold resize-none"
      />
      {status === "error" && <p className="text-red-400 text-sm">{tr.error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 rounded-full bg-nyc-gold text-nyc-base font-medium hover:bg-nyc-gold-light transition disabled:opacity-50"
      >
        {status === "sending" ? tr.sending : tr.send}
      </button>
    </form>
  );
}