export default function BrandMark({ size = 48 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 border-2 border-nyc-gold-light"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 30%, #d4a24c, #9c6f22 70%)",
      }}
    >
      <span
        className="text-nyc-base leading-none text-center"
        style={{
          fontSize: size * 0.28,
          fontWeight: 600,
          fontFamily: '"Nyala", "Noto Sans Ethiopic", "Abyssinica SIL", sans-serif',
        }}
      >
        ኒዮርክ
      </span>
    </div>
  );
}