"use client";

import { useState } from "react";

type Category = { id: string; nameEn: string };

export default function CategoryPicker({
  categories,
  initialSelected = [],
}: {
  categories: Category[];
  initialSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <div>
      <p className="text-sm text-neutral-300 mb-2">
        Which categories does this dish belong to? (choose as many as fit)
      </p>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-nyc-gold text-nyc-base"
                  : "bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-nyc-gold/40"
              }`}
            >
              {c.nameEn}
            </button>
          );
        })}
      </div>

      {/* Hidden real checkboxes so the surrounding <form> still submits categoryIds normally */}
      {categories.map((c) => (
        <input
          key={c.id}
          type="checkbox"
          name="categoryIds"
          value={c.id}
          checked={selected.includes(c.id)}
          readOnly
          hidden
        />
      ))}
    </div>
  );
}