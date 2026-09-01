"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SUPPORTED_CITIES } from "@/context/LocationContext";
import { 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Lock, 
  FileCheck2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function ShowroomRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    city: "Ongole",
    area: "",
    phone: "",
    password: "",
    gstin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/showroom/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register showroom");

      setSuccess(true);
      setTimeout(() => {
        router.push("/showroom/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30 mb-3">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Partner with ElectroCompare</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              List your showroom prices, attract verified local buyers, and grow offline sales.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="py-12 text-center text-emerald-600 space-y-3">
              <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-slate-900">Registration Successful!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your showroom account has been verified. Redirecting you to dealer sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Showroom & Owner Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Showroom / Store Name</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                    <Store className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lotus Electronics"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Manager Name</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                    <User className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. R. K. Sharma"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* City and Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                  >
                    {SUPPORTED_CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}, {c.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Area</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Trunk Road / MG Road"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Phone and GSTIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (Optional)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                    <FileCheck2 className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="37AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portal Access Password</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-emerald-500">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
              >
                {loading ? "Registering Showroom..." : "Complete Partner Registration"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs">
            <span className="text-slate-500 font-medium">Already registered as a partner? </span>
            <Link href="/showroom/login" className="text-emerald-600 font-bold hover:underline">
              Showroom Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}