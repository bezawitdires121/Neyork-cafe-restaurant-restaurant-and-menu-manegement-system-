import { Users } from "lucide-react";

type TableWithStatus = {
  id: string;
  number: string;
  capacity: number;
  isEnabled: boolean;
  orderStatus: "RECEIVED" | "PREPARING" | "SERVED" | null;
};

type FloorData = {
  id: string;
  name: string;
  tables: TableWithStatus[];
};

const statusStyles: Record<string, string> = {
  available: "bg-green-500/10 border-green-500/30 text-green-400",
  waiting: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  occupied: "bg-nyc-gold/10 border-nyc-gold/40 text-nyc-gold-light",
  disabled: "bg-nyc-taupe/5 border-nyc-taupe/20 text-nyc-taupe/50",
};

function getTableState(table: TableWithStatus) {
  if (!table.isEnabled) return "disabled";
  if (!table.orderStatus) return "available";
  if (table.orderStatus === "RECEIVED") return "waiting";
  return "occupied"; // PREPARING or SERVED
}

const stateLabels: Record<string, string> = {
  available: "Available",
  waiting: "Waiting",
  occupied: "Occupied",
  disabled: "Disabled",
};

export default function FloorView({ floors }: { floors: FloorData[] }) {
  return (
    <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-nyc-taupe text-xs uppercase tracking-wider">Restaurant Floor</p>
        <div className="flex items-center gap-4 text-xs text-nyc-taupe">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Waiting</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-nyc-gold" /> Occupied</span>
        </div>
      </div>

      <div className="space-y-6">
        {floors.map((floor) => (
          <div key={floor.id}>
            <p className="text-nyc-cream text-sm font-medium mb-3">{floor.name}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {floor.tables.map((table) => {
                const state = getTableState(table);
                return (
                  <div
                    key={table.id}
                    className={`rounded-xl border p-3 text-center transition-colors ${statusStyles[state]}`}
                  >
                    <p className="font-display text-lg">{table.number}</p>
                    <p className="flex items-center justify-center gap-1 text-[10px] mt-1 opacity-80">
                      <Users size={10} /> {table.capacity}
                    </p>
                    <p className="text-[10px] mt-1 font-medium">{stateLabels[state]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}