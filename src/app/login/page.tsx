"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ShieldCheck,
  BadgeDollarSign,
} from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"ADMIN" | "CASHIER">("ADMIN");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid username or password.");
      return;
    }

    // Confirm the logged-in user's actual role matches the tab they picked
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const actualRole = session?.user?.role;

    if (actualRole !== role) {
      setError(`This account is not a ${role.toLowerCase()} account.`);
      await fetch("/api/auth/signout", { method: "POST" });
      return;
    }

    router.push(role === "ADMIN" ? "/admin" : "/cashier");
    router.refresh();
  };

  return (
  <div className="min-h-screen flex items-center justify-center px-6 bg-nyc-cream dark:bg-nyc-base">

    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-md
        rounded-[32px]
        border border-nyc-gold/20
        bg-white/60 dark:bg-[#1d1a17]
        backdrop-blur-xl
        shadow-2xl
        p-8
        space-y-5
      "
    >

      {/* Header */}
      <div className="text-center mb-8">

        

<h1 className="text-2xl font-display text-nyc-black text-center">
  Welcome to New York Cafe
</h1>

<p className="text-neutral-400 text-sm text-center">
  Select your role to access the system
</p>

      </div>


      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-4">


        <button
          type="button"
          onClick={() => setRole("ADMIN")}
          className={`
            rounded-2xl
            border
            p-5
            transition-all
            ${
              role === "ADMIN"
              ? "bg-nyc-gold text-nyc-base border-nyc-gold"
              : "border-nyc-gold/20 text-nyc-base dark:text-nyc-cream"
            }
          `}
        >

          <ShieldCheck
            className="mx-auto mb-2"
            size={28}
          />

          <span className="text-sm font-medium">
            Administrator
          </span>

        </button>



        <button
          type="button"
          onClick={() => setRole("CASHIER")}
          className={`
            rounded-2xl
            border
            p-5
            transition-all
            ${
              role === "CASHIER"
              ? "bg-nyc-gold text-nyc-base border-nyc-gold"
              : "border-nyc-gold/20 text-nyc-base dark:text-nyc-cream"
            }
          `}
        >

          <BadgeDollarSign
            className="mx-auto mb-2"
            size={28}
          />

          <span className="text-sm font-medium">
            Cashier
          </span>

        </button>


      </div>



      {/* Inputs */}

      <div className="relative mt-6">

        <User 
          className="absolute left-4 top-3 text-nyc-gold"
          size={20}
        />

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="
            w-full
            rounded-xl
            border border-nyc-gold/20
            bg-transparent
            py-3
            pl-12
            text-nyc-base
            dark:text-nyc-cream
            focus:outline-none
            focus:border-nyc-gold
          "
          required
        />

      </div>



      <div className="relative">

        <Lock
          className="absolute left-4 top-3 text-nyc-gold"
          size={20}
        />

        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-3 py-2 pr-10 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-neutral-500"
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
  >
    {showPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>

      </div>



      {error && (
        <p className="text-red-500 text-sm text-center">
          {error}
        </p>
      )}



      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-3
          rounded-full
          bg-nyc-gold
          text-nyc-base
          font-medium
          hover:bg-nyc-gold-light
          transition
          disabled:opacity-50
        "
      >
        {loading
          ? "Signing in..."
          : `Sign in as ${role === "ADMIN" ? "Administrator" : "Cashier"}`
        }
      </button>


    </form>

  </div>
);
}