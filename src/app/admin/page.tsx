import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();
  return (
    <div className="p-8 text-white bg-neutral-950 min-h-screen">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-neutral-400 mt-2">Logged in as: {session?.user?.name} ({(session?.user as any)?.role})</p>
    </div>
  );
}