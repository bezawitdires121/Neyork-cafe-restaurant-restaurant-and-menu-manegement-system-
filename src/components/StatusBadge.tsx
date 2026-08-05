type Variant = "success" | "warning" | "neutral" | "danger" | "gold";

const variants: Record<Variant, string> = {
  success: "bg-green-500/15 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  neutral: "bg-nyc-taupe/15 text-nyc-taupe border-nyc-taupe/20",
  danger: "bg-red-500/15 text-red-400 border-red-500/20",
  gold: "bg-nyc-gold/15 text-nyc-gold-light border-nyc-gold/20",
};

export default function StatusBadge({ label, variant = "neutral" }: { label: string; variant?: Variant }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors hover:brightness-110 ${variants[variant]}`}
    >
      {label}
    </span>
  );
}