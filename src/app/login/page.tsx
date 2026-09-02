"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { User, Lock, Mail, Phone, ArrowRight, Store, KeyRound, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(true);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP Step States
  const [step, setStep] = useState<"form" | "otp">("form");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Generate & Send OTP to Mobile & Email
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (phone.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    // 6-digit random OTP create chesthunnam
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    // Testing alert & notification
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setSuccessMsg(`OTP sent to +91 ${phone} and ${email}! (Your Demo OTP is: ${otp})`);
    }, 600);
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setError("Incorrect OTP. Please enter the 6-digit code correctly.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Sign In page ki redirect cheyadam
      setIsRegister(false);
      setStep("form");
      setEnteredOtp("");
      setError("");
      setSuccessMsg("Account verified successfully! Please sign in with your credentials.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Normal Sign In Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password, role: "customer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      const userToStore = data.user || {
        name: data.name || (name.trim() ? name : email.split("@")[0]),
        email: email,
        phone: phone || "+91 98765 43210",
        city: "Ongole, AP",
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      window.dispatchEvent(new Event("storage"));
      router.push("/");
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
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30 mb-3">
              {step === "otp" ? <KeyRound className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <h1 className="text-xl font-black text-slate-900">
              {isRegister
                ? step === "otp" ? "Enter Verification Code" : "Create Customer Account"
                : "Customer Sign In"}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {isRegister
                ? step === "otp"
                  ? "Enter the 6-digit OTP sent to your phone and email"
                  : "Save favorite showroom deals and track price drops"
                : "Sign in to track comparisons and contact dealers"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form with Mobile */}
          {isRegister && step === "form" && (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? "Sending OTP..." : "Create Free Account"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* OTP Verification Screen */}
          {isRegister && step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus-within:border-blue-500">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                    className="bg-transparent text-center tracking-[0.4em] text-lg font-bold outline-none w-full text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP & Proceed to Sign In"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setError("");
                }}
                className="w-full text-xs text-slate-500 hover:text-slate-800 font-semibold text-center pt-1"
              >
                Change mobile or email details
              </button>
            </form>
          )}

          {/* Normal Sign In Form */}
          {!isRegister && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Toggle between Register and Sign In */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setStep("form");
                setError("");
                setSuccessMsg("");
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer"
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up Free"}
            </button>

            <Link
              href="/showroom/login"
              className="inline-flex items-center justify-center gap-1 text-slate-500 hover:text-slate-800 font-bold mt-2"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" /> Are you a Dealer? Showroom Sign In
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}