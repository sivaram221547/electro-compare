"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Store, Phone, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function ShowroomLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: phone,
          password,
          role: "showroom",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store showroom ID for active dashboard session
      localStorage.setItem("active_showroom_id", data.user.id);
      localStorage.setItem("active_showroom_name", data.user.name);

      router.push("/showroom/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30 mb-3">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-slate-900">Showroom Partner Sign In</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Access your inventory manager to update live prices and stock
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Phone Number
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                <Phone className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="+91 86322 10001"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to Dealer Portal"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs">
            <Link
              href="/showroom/register"
              className="text-emerald-600 hover:underline font-bold"
            >
              Want to partner with us? Register your Showroom
            </Link>
            <Link
              href="/login"
              className="text-slate-400 hover:text-slate-700 font-semibold mt-1"
            >
              Looking for consumer sign in? Customer Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}