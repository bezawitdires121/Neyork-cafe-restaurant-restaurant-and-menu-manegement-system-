"use client";

import { useEffect, useState } from "react";
import { UserPlus, Pencil, Trash2, X } from "lucide-react";

type User = {
  id: string;
  username: string;
  role: "ADMIN" | "CASHIER";
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CASHIER">("CASHIER");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);


  async function fetchUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users");

      if (!res.ok) {
        throw new Error("Failed to load users");
      }

      const data = await res.json();
      setUsers(data);

    } catch (err) {
      setError("Could not load users");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchUsers();
  }, []);



  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });


      const data = await res.json();


      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Failed creating user"
        );
      }


      setMessage("User created successfully");

      setUsername("");
      setPassword("");
      setRole("CASHIER");

      fetchUsers();


    } catch (err: any) {

      setError(err.message);

    }
  }



  async function updateUser(
    id: string,
    data: {
      username?: string;
      password?: string;
      role?: "ADMIN" | "CASHIER";
    }
  ) {

    setMessage("");
    setError("");

    try {

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });


      const result = await res.json();


      if (!res.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Update failed"
        );
      }


      setMessage("User updated successfully");
      setEditingUser(null);

      fetchUsers();


    } catch (err: any) {

      setError(err.message);

    }

  }



  async function deleteUser(id: string) {

    setMessage("");
    setError("");

    try {

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });


      const data = await res.json();


      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Delete failed"
        );
      }


      setMessage("User deleted successfully");

      setDeletingUser(null);

      fetchUsers();


    } catch (err: any) {

      setError(err.message);

    }

  }
    return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display text-nyc-base dark:text-nyc-cream">
          User Management
        </h1>

        <p className="text-sm text-neutral-500 mt-2">
          Manage administrator and cashier accounts.
        </p>
      </div>


      {/* Messages */}
      {message && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-600">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-500">
          {error}
        </div>
      )}



      {/* Create User */}
      <div className="
        rounded-3xl
        border border-nyc-gold/20
        bg-white/50
        dark:bg-[#1d1a17]
        p-6
      ">

        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-nyc-gold" />
          <h2 className="text-xl font-semibold">
            Create User
          </h2>
        </div>


        <form
          onSubmit={createUser}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="
              rounded-xl
              border border-nyc-gold/20
              px-4 py-3
              bg-transparent
              outline-none
            "
            required
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="
              rounded-xl
              border border-nyc-gold/20
              px-4 py-3
              bg-transparent
              outline-none
            "
            required
          />


          <select
            value={role}
            onChange={(e)=>setRole(e.target.value as "ADMIN" | "CASHIER")}
            className="
              rounded-xl
              border border-nyc-gold/20
              px-4 py-3
              bg-transparent
              outline-none
            "
          >
            <option value="ADMIN">
              Administrator
            </option>

            <option value="CASHIER">
              Cashier
            </option>

          </select>



          <button
            className="
              rounded-xl
              bg-nyc-gold
              text-nyc-base
              font-medium
              hover:bg-nyc-gold-light
              transition
            "
          >
            Create
          </button>

        </form>

      </div>





      {/* Users Table */}
      <div className="
        rounded-3xl
        border border-nyc-gold/20
        bg-white/50
        dark:bg-[#1d1a17]
        overflow-hidden
      ">


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-nyc-gold/20 text-left">

                <th className="p-5">
                  Username
                </th>

                <th className="p-5">
                  Role
                </th>

                <th className="p-5">
                  Created
                </th>

                <th className="p-5 text-right">
                  Actions
                </th>

              </tr>
            </thead>



            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center"
                  >
                    Loading users...
                  </td>
                </tr>

              ) : users.length === 0 ? (

                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center"
                  >
                    No users found.
                  </td>
                </tr>


              ) : (

                users.map((user)=>(
                  <tr
                    key={user.id}
                    className="border-b border-nyc-gold/10"
                  >

                    <td className="p-5">
                      {user.username}
                    </td>


                    <td className="p-5">

                      <span
                        className={`
                          px-3 py-1
                          rounded-full
                          text-xs
                          ${
                            user.role === "ADMIN"
                            ? "bg-nyc-gold/20 text-nyc-gold"
                            : "bg-neutral-500/20 text-neutral-500"
                          }
                        `}
                      >
                        {user.role}
                      </span>

                    </td>


                    <td className="p-5 text-sm text-neutral-500">

                      {new Date(user.createdAt)
                        .toLocaleDateString()
                      }

                    </td>


                    <td className="p-5">

                      <div className="flex justify-end gap-2">


                        <button
                          onClick={()=>setEditingUser(user)}
                          className="
                            p-2
                            rounded-lg
                            hover:bg-nyc-gold/10
                            transition
                          "
                        >
                          <Pencil size={18}/>
                        </button>



                        <button
                          onClick={()=>setDeletingUser(user)}
                          className="
                            p-2
                            rounded-lg
                            text-red-500
                            hover:bg-red-500/10
                            transition
                          "
                        >
                          <Trash2 size={18}/>
                        </button>


                      </div>

                    </td>


                  </tr>
                ))

              )}

            </tbody>

          </table>

        </div>


      </div>
            {/* Edit Modal */}
      {editingUser && (

        <div className="
          fixed inset-0
          bg-black/50
          flex items-center justify-center
          z-50
          px-6
        ">

          <div className="
            w-full max-w-md
            rounded-3xl
            bg-white
            dark:bg-[#1d1a17]
            p-6
            border border-nyc-gold/20
          ">


            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-semibold">
                Edit User
              </h2>


              <button
                onClick={()=>setEditingUser(null)}
              >
                <X size={20}/>
              </button>

            </div>



            <EditForm
              user={editingUser}
              onSave={updateUser}
              onCancel={()=>setEditingUser(null)}
            />


          </div>

        </div>

      )}





      {/* Delete Modal */}
      {deletingUser && (

        <div className="
          fixed inset-0
          bg-black/50
          flex items-center justify-center
          z-50
          px-6
        ">


          <div className="
            max-w-md
            w-full
            rounded-3xl
            bg-white
            dark:bg-[#1d1a17]
            p-6
            border border-nyc-gold/20
          ">


            <h2 className="text-xl font-semibold mb-4">
              Delete User
            </h2>


            <p className="text-sm text-neutral-500 mb-6">
              Are you sure you want to delete 
              <span className="font-semibold">
                {" "}{deletingUser.username}
              </span>
              ?
            </p>



            <div className="flex justify-end gap-3">


              <button
                onClick={()=>setDeletingUser(null)}
                className="
                  px-5 py-2
                  rounded-full
                  border border-nyc-gold/20
                "
              >
                Cancel
              </button>


              <button
                onClick={()=>deleteUser(deletingUser.id)}
                className="
                  px-5 py-2
                  rounded-full
                  bg-red-500
                  text-white
                "
              >
                Delete
              </button>


            </div>


          </div>

        </div>

      )}



    </div>
  );
}





function EditForm({
  user,
  onSave,
  onCancel,
}: {
  user: User;
  onSave: (
    id:string,
    data:{
      username?:string;
      password?:string;
      role?:"ADMIN"|"CASHIER";
    }
  )=>void;

  onCancel:()=>void;

}) {


  const [username,setUsername] = useState(user.username);
  const [password,setPassword] = useState("");
  const [role,setRole] = useState<"ADMIN"|"CASHIER">(user.role);



  function submit(e:React.FormEvent){

    e.preventDefault();


    onSave(
      user.id,
      {
        username,
        password: password || undefined,
        role,
      }
    );

  }



  return (

    <form
      onSubmit={submit}
      className="space-y-4"
    >


      <input
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        className="
          w-full
          rounded-xl
          border border-nyc-gold/20
          px-4 py-3
          bg-transparent
        "
        placeholder="Username"
      />



      <input
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="
          w-full
          rounded-xl
          border border-nyc-gold/20
          px-4 py-3
          bg-transparent
        "
        placeholder="New password (optional)"
      />



      <select
        value={role}
        onChange={(e)=>setRole(e.target.value as "ADMIN"|"CASHIER")}
        className="
          w-full
          rounded-xl
          border border-nyc-gold/20
          px-4 py-3
          bg-transparent
        "
      >

        <option value="ADMIN">
          Administrator
        </option>


        <option value="CASHIER">
          Cashier
        </option>


      </select>




      <div className="flex justify-end gap-3">


        <button
          type="button"
          onClick={onCancel}
          className="
            px-5 py-2
            rounded-full
            border border-nyc-gold/20
          "
        >
          Cancel
        </button>



        <button
          className="
            px-5 py-2
            rounded-full
            bg-nyc-gold
            text-nyc-base
          "
        >
          Save
        </button>


      </div>


    </form>

  );

}