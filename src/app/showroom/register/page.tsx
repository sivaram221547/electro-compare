"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Building2, 
  FileCheck, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Compass, 
  Clock, 
  CalendarDays,
  KeyRound
} from "lucide-react";

export default function ShowroomRegisterPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Owner & Login Details
  const [step1, setStep1] = useState({
    ownerName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  // Step 2: Showroom Information
  const [step2, setStep2] = useState({
    showroomName: "",
    category: "MULTI_BRAND",
    address: "",
    villageTown: "",
    city: "Ongole",
    district: "Prakasam",
    state: "Andhra Pradesh",
    pincode: "",
    latitude: "" as string | number,
    longitude: "" as string | number,
    showroomPhone: "",
    showroomEmail: "",
    workingHours: "10:00 AM - 09:30 PM",
    weeklyHoliday: "None",
  });

  // Step 3: KYC & Verification
  const [step3, setStep3] = useState({
    gstNumber: "",
    frontPhoto: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500",
    insidePhoto: "",
    ownerIdProof: "",
  });

  // Auto GPS Location Fetch
  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStep2((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      (err) => {
        alert("Permission denied or failed to get location: " + err.message);
      }
    );
  };

  // Step 1: Mobile OTP Verification Handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (step1.mobileNumber.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(randomCode);
    setOtpSent(true);
  };

  const handleVerifyStep1Otp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== demoOtp) {
      setError("Invalid OTP. Please enter the correct code.");
      return;
    }
    setError("");
    setCurrentStep(2);
  };

  // Final Registration Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/showroom/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step1, step2, step3 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit showroom application");

      setCurrentStep(4); // Success / Pending Screen
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        
        {/* Registration Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Showroom Partner Registration</h1>
          <p className="text-xs text-slate-500 mt-1">
            Join ElectroCompare to list your local showroom inventory and connect with nearby buyers
          </p>
        </div>

        {/* 3-Step Visual Progress Tracker */}
        {currentStep !== 4 && (
          <div className="flex items-center justify-between mb-8 px-4 max-w-lg mx-auto">
            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 1 ? "text-blue-600" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border-2 ${currentStep >= 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-300"}`}>
                1
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Owner</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 ${currentStep >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 2 ? "text-blue-600" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border-2 ${currentStep >= 2 ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-300"}`}>
                2
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Showroom</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 ${currentStep >= 3 ? "bg-blue-600" : "bg-slate-200"}`} />

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 3 ? "text-blue-600" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border-2 ${currentStep >= 3 ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-300"}`}>
                3
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">KYC Verification</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl">
          
          {/* STEP 1: Owner & Login Details */}
          {currentStep === 1 && !otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Step 1: Owner & Login Credentials
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name *</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter owner full name"
                    value={step1.ownerName}
                    onChange={(e) => setStep1({ ...step1, ownerName: e.target.value })}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (For Verification) *</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={step1.mobileNumber}
                    onChange={(e) => setStep1({ ...step1, mobileNumber: e.target.value.replace(/\D/g, "") })}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="owner@example.com"
                    value={step1.email}
                    onChange={(e) => setStep1({ ...step1, email: e.target.value })}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Password *</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={step1.password}
                    onChange={(e) => setStep1({ ...step1, password: e.target.value })}
                    className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Send Mobile Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 1 OTP Verification */}
          {currentStep === 1 && otpSent && (
            <form onSubmit={handleVerifyStep1Otp} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-medium text-center">
                OTP sent to +91 {step1.mobileNumber} (Demo OTP: <strong className="font-black text-blue-900">{demoOtp}</strong>)
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP *</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    placeholder="• • • • • •"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="bg-transparent text-center tracking-[0.4em] text-lg font-black outline-none w-full text-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-1/3 border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-50"
                >
                  Edit Details
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Verify & Proceed to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Showroom Details & GPS */}
          {currentStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }} className="space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Step 2: Showroom Info & GPS Pinning
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Showroom Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pai International, Lotus"
                    value={step2.showroomName}
                    onChange={(e) => setStep2({ ...step2, showroomName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Showroom Category *</label>
                  <select
                    value={step2.category}
                    onChange={(e) => setStep2({ ...step2, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="MULTI_BRAND">Multi-brand Electronics</option>
                    <option value="HOME_APPLIANCES">Home Appliances</option>
                    <option value="MOBILE_ACCESSORIES">Mobile & Accessories</option>
                    <option value="COMPUTERS_LAPTOPS">Computer & Laptops</option>
                    <option value="ELECTRONICS">Electronics Specialty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Showroom Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Door No, Street name, Landmark"
                  value={step2.address}
                  onChange={(e) => setStep2({ ...step2, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Town/Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="Trunk Road"
                    value={step2.villageTown}
                    onChange={(e) => setStep2({ ...step2, villageTown: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ongole"
                    value={step2.city}
                    onChange={(e) => setStep2({ ...step2, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    placeholder="Prakasam"
                    value={step2.district}
                    onChange={(e) => setStep2({ ...step2, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="523001"
                    value={step2.pincode}
                    onChange={(e) => setStep2({ ...step2, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Automatic GPS Capture */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-600" /> Auto-Capture GPS Location
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {step2.latitude ? `Lat: ${step2.latitude}, Lng: ${step2.longitude}` : "Capture accurate pin for customer map navigation"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  className="px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  {step2.latitude ? "Update GPS Pin" : "Detect Showroom GPS"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Working Hours</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="10:00 AM - 09:30 PM"
                      value={step2.workingHours}
                      onChange={(e) => setStep2({ ...step2, workingHours: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Weekly Holiday</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="None or Sunday"
                      value={step2.weeklyHoliday}
                      onChange={(e) => setStep2({ ...step2, weeklyHoliday: e.target.value })}
                      className="bg-transparent text-xs outline-none w-full font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Step 3 (KYC)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Verification & KYC */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" /> Step 3: Verification & Store Proofs
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="37AAAAA0000A1Z5"
                  value={step3.gstNumber}
                  onChange={(e) => setStep3({ ...step3, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Showroom Front Photo URL *</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={step3.frontPhoto}
                    onChange={(e) => setStep3({ ...step3, frontPhoto: e.target.value })}
                    className="bg-transparent text-xs outline-none w-full font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inside Showroom Photo URL (Optional)</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={step3.insidePhoto}
                    onChange={(e) => setStep3({ ...step3, insidePhoto: e.target.value })}
                    className="bg-transparent text-xs outline-none w-full font-semibold"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed font-medium">
                Note: Products won&apos;t be listed until our team verifies the showroom location and business details.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/3 border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Submitting Application..." : "Submit for Verification"}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Pending Verification State */}
          {currentStep === 4 && (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Application Submitted!</h3>
                <p className="text-xs font-bold text-amber-600 mt-1 uppercase tracking-wider">
                  Pending Verification ⏳
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                  Your showroom details have been recorded. Once our team approves your store proof, your showroom will be verified and you can start linking products to publish live prices.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Back to Home
                </Link>
                <Link
                  href="/showroom/dashboard"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20"
                >
                  View Showroom Dashboard →
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}