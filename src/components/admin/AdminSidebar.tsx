"use client";

import Link from "next/link";
import { BarChart3, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Layers,
  Tags,
  UtensilsCrossed,
  Star,
  ShoppingBag,
  Image as ImageIcon,
  Mail,
  Leaf,
} from "lucide-react";
import type { ComponentType } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  badgeKey?: "reviews" | "messages";
};

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/settings",
    label: "Restaurant Settings",
    icon: Settings,
  },
  {
    href: "/admin/floors",
    label: "Floors & Tables",
    icon: Layers,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    href: "/admin/menu",
    label: "Menu Items",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: ImageIcon,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: Star,
    badgeKey: "reviews",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/admin/contact-messages",
    label: "Contact Messages",
    icon: Mail,
    badgeKey: "messages",
  },
  {
    href: "/admin/users",
    label: "User Management",
    icon: Users,
  },
  {
    href: "/admin/diet-types",
    label: "Fasting Options",
    icon: Leaf,
  },
];

export default function AdminSidebar({
  userName,
  badges,
}: {
  userName?: string | null;
  badges: {
    reviews: number;
    messages: number;
  };
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-nyc-gold/10 p-5 flex flex-col">
      <div className="mb-8 px-2">
        <h2 className="font-display text-lg text-nyc-cream">
          NYC Admin
        </h2>

        <p className="text-nyc-taupe text-xs mt-0.5">
          New York Cafe & Restaurant
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          const badgeCount = item.badgeKey
            ? badges[item.badgeKey]
            : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-nyc-gold/15 text-nyc-cream font-medium"
                  : "text-nyc-taupe hover:bg-nyc-gold/10 hover:text-nyc-cream"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />

              <span className="flex-1">
                {item.label}
              </span>

              {badgeCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-nyc-wine text-nyc-cream text-[10px] font-semibold">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-nyc-gold/10 px-2">
        <p className="text-nyc-taupe text-xs">
          Logged in as
        </p>

        <p className="text-nyc-cream text-sm font-medium">
          {userName}
        </p>
      </div>
    </aside>
  );
}