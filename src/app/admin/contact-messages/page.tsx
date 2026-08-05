import { prisma } from "@/lib/prisma";
import { deleteContactMessage } from "@/lib/actions/contact";

export default async function AdminContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  

  return (
    // ...unchanged
    <div>
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>

      <div className="space-y-3 max-w-2xl">
        {messages.map((m) => (
          <div key={m.id} className="border border-neutral-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-neutral-500">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-neutral-500">{new Date(m.createdAt).toLocaleString()}</p>
                <form action={deleteContactMessage.bind(null, m.id)}>
                  <button type="submit" className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </form>
              </div>
            </div>
            <p className="text-sm text-neutral-300">{m.message}</p>
          </div>
        ))}
      </div>

      {messages.length === 0 && <p className="text-neutral-500">No messages yet.</p>}
    </div>
  );
}