import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNotificationListener from "@/components/admin/AdminNotificationListener";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/login");
  }

  const [pendingReviews, messageCount] = await Promise.all([
    prisma.review.count({
      where: {
        isApproved: false,
        wasReviewed: false,
      },
    }),
    prisma.contactMessage.count(),
  ]);

  return (
    <div className="min-h-screen flex bg-nyc-base text-nyc-cream">
      <AdminNotificationListener
        initial={{
          reviews: pendingReviews,
          messages: messageCount,
        }}
      />

      <AdminSidebar
        userName={session?.user?.name}
        badges={{
          reviews: pendingReviews,
          messages: messageCount,
        }}
      />

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}