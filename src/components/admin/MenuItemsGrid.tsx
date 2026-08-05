"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import {
  Pencil,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Search,
} from "lucide-react";
import {
  toggleMenuItemAvailable,
  toggleMenuItemFeatured,
  deleteMenuItem,
} from "@/lib/actions/menu-items";

type Props = {
  items: any[];
};

export default function MenuItemsGrid({ items }: Props) {
  const [search, setSearch] = useState("");
  async function handleFeatured(id: string, value: boolean) {
  const result = await toggleMenuItemFeatured(id, value);

  if (result?.success) {
    toast.success("Featured status updated");
  } else {
    toast.error("Something went wrong. Please try again soon.");
  }
}


async function handleAvailable(id: string, value: boolean) {
  const result = await toggleMenuItemAvailable(id, value);

  if (result?.success) {
    toast.success("Availability updated");
  } else {
    toast.error("Something went wrong. Please try again soon.");
  }
}


async function handleDelete(id: string) {
  const confirmed = confirm("Delete this menu item?");

  if (!confirmed) return;

  const result = await deleteMenuItem(id);

  if (result?.success) {
    toast.success("Menu item deleted successfully");
  } else {
    toast.error("Something went wrong. Please try again soon.");
  }
}

  const filteredItems = useMemo(() => {
  const q = search.toLowerCase().trim();

  return items.filter((item) =>
    item.nameEn.toLowerCase().includes(q) ||
    item.nameAm.toLowerCase().includes(q) ||
    item.category.nameEn.toLowerCase().includes(q) ||
    item.category.nameAm.toLowerCase().includes(q)
  );
}, [items, search]);

  return (
    <>
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
          size={18}
        />

         <input

  value={search}

  onChange={(e) => setSearch(e.target.value)}

  placeholder="Search by item name or category..."

  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-3 pl-11 pr-4 text-white outline-none focus:border-nyc-gold"

/>
      </div>

     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {filteredItems.map((item) => (
    <div
      key={item.id}
      className={`border rounded-lg p-4 ${
        item.isAvailable
          ? "border-neutral-800"
          : "border-neutral-900 opacity-50"
      }`}
    >
      {item.imageUrl && (
        <div className="relative w-full h-32 mb-2 rounded-md overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.nameEn}
            fill
            className="object-cover"
          />
        </div>
      )}

      <p className="font-medium">{item.nameEn}</p>
      <p className="text-neutral-500 text-sm">{item.nameAm}</p>
      <p className="text-sm text-neutral-400 mt-1">
        {item.category.nameEn}
      </p>
      <p className="text-sm mt-1">
        {item.priceETB} ETB / ${item.priceUSD}
      </p>

      <div className="flex items-center justify-between mt-4 border-t border-neutral-800 pt-3">
        <Link
          href={`/admin/menu/${item.id}/edit`}
          className="rounded-lg p-2 text-nyc-gold hover:bg-nyc-gold/10 hover:text-nyc-gold-light transition"
          title="Edit"
        >
          <Pencil size={18} />
        </Link>

       <button
  onClick={() =>
    handleFeatured(item.id, !item.isFeatured)
  }
        
            type="submit"
            title={item.isFeatured ? "Featured" : "Feature"}
            className={`rounded-lg p-2 transition ${
              item.isFeatured
                ? "text-yellow-400 hover:bg-yellow-400/10"
                : "text-neutral-400 hover:text-yellow-400 hover:bg-yellow-400/10"
            }`}
          >
            <Star
              size={18}
              fill={item.isFeatured ? "currentColor" : "none"}
            />
          </button>
       

        <button
 onClick={() =>
   handleAvailable(item.id, !item.isAvailable)
 }
        
            type="submit"
            title={item.isAvailable ? "Disable" : "Enable"}
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 transition"
          >
            {item.isAvailable ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
          </button>
        

        <button
 onClick={() => handleDelete(item.id)}
            type="submit"
            title="Delete"
            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <Trash2 size={18} />
          </button>
        
      </div>
    </div>
  ))}
</div>
    </>
  );
}