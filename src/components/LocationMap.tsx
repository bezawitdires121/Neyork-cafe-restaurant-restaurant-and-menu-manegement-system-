export default function LocationMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="w-full h-80 rounded-xl overflow-hidden border border-nyc-gold/30">
      <iframe
        title="New York Cafe & Restaurant location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
      />
    </div>
  );
}