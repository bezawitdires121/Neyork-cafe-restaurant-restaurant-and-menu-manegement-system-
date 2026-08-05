import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return { authorized: false as const, userId: null };
  }
  return { authorized: true as const, userId: (session?.user as any)?.id as string };
}