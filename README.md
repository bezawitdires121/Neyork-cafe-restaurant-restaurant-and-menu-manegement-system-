# New York Cafe & Restaurant

Full-stack restaurant platform built for New York Cafe & Restaurant (Bahir Dar, Ethiopia): a public website, bilingual digital menu, live ordering system, and separate cashier and admin dashboards, all running on one codebase.

**Live:** https://neyork-cafe-restaurant-restaurant-a.vercel.app

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma 7, Supabase (Postgres + Storage), NextAuth v5, Zustand, Framer Motion, Recharts.

## What it does

**Public site** - Home, About, Gallery, Reviews, Contact. Every page works in English and Amharic, with the customer's choice remembered site-wide.

**Digital menu** - search, category and fasting/non-fasting filters, sort, grid/list view, currency switch (ETB/USD), light and dark themes. Menu items can belong to multiple categories at once (a pasta dish can live under Breakfast, Lunch, and Dinner without duplicating the item).

**Ordering** - Dine-In, Takeaway, and Delivery, each with its own required fields. Cash, Telebirr, and mobile banking as payment options, with the restaurant's actual Telebirr number and bank details shown at checkout. Customers get a live order-tracking widget that follows them across the site after they leave the confirmation page.

**Call Waiter** - customers request bill, water, bread, or help from a table without needing a waiter app or login.

**Cashier dashboard** - live order queue, payment verification, a visual floor/table map showing which tables are occupied, and daily sales broken down by payment method. New orders and requests trigger a sound and popup.

**Admin dashboard** - manages the restaurant profile, floors and tables, categories, menu items (with image upload), gallery, reviews (moderated before going public), contact messages, user accounts and roles, and a revenue/best-sellers analytics page. Notification badges show what needs attention.

**QR code** - generated in-app, no third-party service, prints straight from the browser.

## Structure

Standard Next.js App Router layout. Server actions in `src/lib/actions` handle all writes; Prisma schema in `prisma/schema.prisma`. Auth is role-based (Admin, Cashier) via NextAuth credentials.

## Running locally

```
npm install
npx prisma generate
npm run dev
```

Needs a `.env` with `DATABASE_URL`, Supabase keys, and `AUTH_SECRET`. See `.env.example` for the full list.
