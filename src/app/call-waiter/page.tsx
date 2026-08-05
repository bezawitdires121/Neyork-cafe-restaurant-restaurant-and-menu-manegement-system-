"use client";

import { useState, useEffect } from "react";
import { createWaiterRequest } from "@/lib/actions/waiter-requests";
import { useLanguage } from "@/lib/language-context";
import { Receipt, GlassWater, Croissant, HelpCircle, MessageCircleQuestion, CheckCircle2 } from "lucide-react";

type Floor = { id: string; name: string; nameAm?: string | null; tables: { id: string; number: string; isEnabled: boolean }[] };

const requestTypes = [
  { value: "BILL", en: "Bill", am: "ሂሳብ", icon: Receipt },
  { value: "WATER", en: "Water", am: "ውሃ", icon: GlassWater },
  { value: "BREAD_INJERA", en: "Bread / Injera", am: "ዳቦ / እንጀራ", icon: Croissant },
  { value: "ASSISTANCE", en: "Assistance to Order", am: "ትዕዛዝ እርዳታ", icon: MessageCircleQuestion },
  { value: "OTHER", en: "Other", am: "ሌላ", icon: HelpCircle },
] as const;

export default function CallWaiterPage() {
  const { lang } = useLanguage();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorId, setFloorId] = useState("");
  const [tableId, setTableId] = useState("");
  const [type, setType] = useState<typeof requestTypes[number]["value"]>("ASSISTANCE");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/floors").then((r) => r.json()).then(setFloors);
  }, []);

  const selectedFloor = floors.find((f) => f.id === floorId);

  const t = {
    title: lang === "en" ? "Call Waiter" : "አስተናጋጅ ይጥሩ",
    selectFloor: lang === "en" ? "Select floor" : "ወለል ይምረጡ",
    selectTable: lang === "en" ? "Select table" : "ጠረጴዛ ይምረጡ",
    note: lang === "en" ? "Additional note (optional)" : "ተጨማሪ ማስታወሻ (አማራጭ)",
    submit: lang === "en" ? "Send Request" : "ጥያቄ ላክ",
    sent: lang === "en" ? "A waiter has been notified. Someone will be with you shortly." : "አስተናጋጅ ተነግሮታል። በቅርቡ ይመጣል።",
    error: lang === "en" ? "Please select floor and table." : "እባክዎ ወለል እና ጠረጴዛ ይምረጡ።",
    another: lang === "en" ? "Send another request" : "ሌላ ጥያቄ ላክ",
  };

  const handleSubmit = async () => {
    setError("");
    if (!floorId || !tableId) return setError(t.error);
    const result = await createWaiterRequest({ floorId, tableId, type, note: note || undefined });
    if (result.success) setSubmitted(true);
  };

  if (submitted) {
  return (
    <div className="min-h-screen bg-nyc-base light:bg-nyc-cream text-nyc-cream light:text-nyc-base flex items-center justify-center p-6 transition-colors">
      <div className="text-center max-w-sm w-full rounded-[var(--radius-panel)] border border-nyc-gold/20 bg-nyc-cream/[0.04] light:bg-nyc-base/[0.03] p-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-nyc-gold/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-nyc-gold" strokeWidth={1.75} />
        </div>
        <p className="text-lg font-display text-nyc-cream light:text-nyc-base mb-2">{t.sent}</p>
        <p className="text-sm text-nyc-cream/60 light:text-nyc-base/60 mb-7">
          {lang === "en" ? "Thank you for your patience." : "ስለ ትዕግስትዎ እናመሰግናለን።"}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="w-full py-3 bg-nyc-gold text-nyc-base rounded-full text-sm font-medium hover:brightness-110 transition-all active:scale-[0.98]"
        >
          {t.another}
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-nyc-base light:bg-nyc-cream text-nyc-cream light:text-nyc-base flex items-center justify-center p-6 transition-colors">
      <div className="max-w-md mx-auto rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-6 sm:p-7">
        <h1 className="font-display text-2xl mb-6">{t.title}</h1>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <select value={floorId} onChange={(e) => { setFloorId(e.target.value); setTableId(""); }} className="input">
           <option value="">{t.selectFloor}</option>
{floors.map((f) => (
  <option key={f.id} value={f.id}>{lang === "en" ? f.name : (f.nameAm || f.name)}</option>
))}
          </select>
          <select value={tableId} onChange={(e) => setTableId(e.target.value)} className="input" disabled={!floorId}>
            <option value="">{t.selectTable}</option>
{selectedFloor?.tables
  .filter((tb) => tb.isEnabled)
  .map((tb) => (
    <option key={tb.id} value={tb.id}>
      {lang === "en" ? `Table ${tb.number}` : `ጠረጴዛ ${tb.number}`}
    </option>
))}
          </select>
        </div>
<p className="text-sm text-nyc-taupe mb-3">
  {lang === "en" ? "What do you need the waiter for?" : "አስተናጋጁን ለምን አገልግሎት ይፈልጋሉ?"}
</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {requestTypes.map((rt) => {
            const Icon = rt.icon;
            return (
              <button
                key={rt.value}
                onClick={() => setType(rt.value)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm transition-colors ${
                  type === rt.value ? "bg-nyc-gold text-nyc-base" : "bg-nyc-cream/5 text-nyc-taupe hover:bg-nyc-cream/10"
                }`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {lang === "en" ? rt.en : rt.am}
              </button>
            );
          })}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.note}
          className="input w-full mb-4"
          rows={2}
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-nyc-gold text-nyc-base rounded-full font-medium hover:brightness-110 transition-all active:scale-[0.98]"
        >
          {t.submit}
        </button>
      </div>
    </div>
  );
}