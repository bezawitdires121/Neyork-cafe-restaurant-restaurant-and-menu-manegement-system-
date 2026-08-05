"use client";

import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus, X, ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";
type User = { id: string; username: string; role: "ADMIN" | "CASHIER"; createdAt: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "CASHIER">("CASHIER");

  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "CASHIER">("CASHIER");

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
    });
    const data = await res.json();
if (!res.ok) {
  toast.error(typeof data.error === "string" ? data.error : "Could not create user.");
  return;
}
toast.success("User created successfully.");
setNewUsername("");
setNewPassword("");
setNewRole("CASHIER");
setShowCreate(false);
loadUsers();
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditUsername(user.username);
    setEditPassword("");
    setEditRole(user.role);
    setError("");
  };

  const handleUpdate = async (id: string) => {
    setError("");
    const payload: any = { username: editUsername, role: editRole };
    if (editPassword) payload.password = editPassword;

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
   const data = await res.json();
if (!res.ok) {
  toast.error(typeof data.error === "string" ? data.error : "Could not update user.");
  return;
}
toast.success("User updated successfully.");
setEditingId(null);
loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
   const data = await res.json();
if (!res.ok) {
  toast.error(data.error || "Could not delete user.");
  return;
}
toast.success("User deleted successfully.");
loadUsers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl text-nyc-cream">User Management</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-nyc-gold text-nyc-base rounded-full text-sm font-medium hover:brightness-110 transition-all"
        >
          {showCreate ? <X size={15} /> : <Plus size={15} />}
          {showCreate ? "Cancel" : "New User"}
        </button>
      </div>

      {showCreate && (
        <div className="rounded-[var(--radius-panel)] border border-nyc-gold/15 bg-nyc-cream/[0.03] p-5 mb-6">
          <p className="text-nyc-taupe text-xs uppercase tracking-wider mb-4">Create New User</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
              className="input sm:col-span-1"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              className="input sm:col-span-1"
            />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as "ADMIN" | "CASHIER")} className="input sm:col-span-1">
              <option value="CASHIER">Cashier</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-nyc-gold text-nyc-base rounded-md text-sm font-medium hover:brightness-110 transition-all"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5">
        {loading ? (
          <p className="text-nyc-taupe text-sm">Loading users...</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-xl border border-nyc-gold/10 bg-nyc-base/40 p-4">
                {editingId === user.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="input" placeholder="Username" />
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="input"
                      placeholder="New password (leave blank to keep)"
                    />
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value as "ADMIN" | "CASHIER")} className="input">
                      <option value="CASHIER">Cashier</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(user.id)} className="flex-1 py-2 bg-nyc-gold text-nyc-base rounded-md text-xs font-medium">
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-nyc-cream/10 text-nyc-cream rounded-md text-xs">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-nyc-gold/15 flex items-center justify-center">
                        {user.role === "ADMIN" ? (
                          <ShieldCheck size={16} className="text-nyc-gold" />
                        ) : (
                          <UserCog size={16} className="text-nyc-gold" />
                        )}
                      </div>
                      <div>
                        <p className="text-nyc-cream text-sm font-medium">{user.username}</p>
                        <p className="text-nyc-taupe text-xs">{user.role} · joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(user)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-nyc-cream/10 text-nyc-taupe hover:text-nyc-cream transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 text-nyc-taupe hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {users.length === 0 && <p className="text-nyc-taupe text-sm">No users found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}