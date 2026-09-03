"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, XCircle, Clock, ShieldCheck, MapPin, Phone, Building2 } from "lucide-react";

export default function AdminShowroomsPage() {
  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShowrooms = async () => {
    try {
      const res = await fetch("/api/admin/showrooms");
      const data = await res.json();
      setShowrooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowrooms();
  }, []);

  const handleUpdateStatus = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/showrooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showroomId: id, status }),
      });
      if (res.ok) {
        fetchShowrooms(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" /> Admin Showroom Approvals
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review documents, store photos, and approve local dealers
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200">
            {showrooms.filter((s) => s.status === "PENDING").length} Pending Verification
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs font-bold text-slate-400">
            Loading applications...
          </div>
        ) : showrooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs font-bold">
            No showroom applications found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showrooms.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" /> {store.showroomName}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Owner: <span className="text-slate-800">{store.ownerName}</span>
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        store.status === "VERIFIED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : store.status === "REJECTED"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {store.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> +91 {store.mobileNumber}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {store.address}, {store.city}
                    </p>
                    {store.gstNumber && (
                      <p className="text-[11px] font-mono font-bold text-slate-700 mt-1">
                        GST: {store.gstNumber}
                      </p>
                    )}
                  </div>

                  {store.frontPhoto && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Store Front Proof</p>
                      <img
                        src={store.frontPhoto}
                        alt="Store Front"
                        className="w-full h-36 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  {store.status !== "VERIFIED" && (
                    <button
                      onClick={() => handleUpdateStatus(store.id, "VERIFIED")}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Showroom
                    </button>
                  )}

                  {store.status !== "REJECTED" && (
                    <button
                      onClick={() => handleUpdateStatus(store.id, "REJECTED")}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}