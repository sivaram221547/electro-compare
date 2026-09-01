"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCompare } from "@/context/CompareContext";
import { Scale, Trash2, X, Store, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (compareItems.length === 0) {
      setDetails([]);
      return;
    }

    const loadAllDetails = async () => {
      setLoading(true);
      try {
        const promises = compareItems.map((item) =>
          fetch(`/api/products/${item.id}`).then((res) => res.json())
        );
        const data = await Promise.all(promises);
        setDetails(data);
      } catch (e) {
        console.error("Error comparing products", e);
      } finally {
        setLoading(false);
      }
    };

    loadAllDetails();
  }, [compareItems]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-600" />
              Appliance Comparison Matrix
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Side-by-side spec comparison and lowest local showroom pricing
            </p>
          </div>

          {compareItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3.5 py-2 rounded-xl border border-red-200 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {compareItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">Your Comparison Tray is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add up to 4 appliances from the home or search page to compare prices and specs.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl mt-5 hover:bg-blue-700 transition"
            >
              Browse Appliances <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-5 w-48 text-xs font-bold text-slate-400 uppercase bg-slate-50/50">
                    Product
                  </th>
                  {details.map((prod) => (
                    <th key={prod.id} className="p-5 align-top min-w-[220px]">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(prod.id)}
                          className="absolute -top-1 -right-1 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-400 rounded-full p-1 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-4xl text-center py-2">{prod.image}</div>
                        <h4 className="text-xs font-black text-slate-900 mt-2 line-clamp-2">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-blue-600 font-bold uppercase block mt-1">
                          {prod.category}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Lowest Price Row */}
                <tr className="bg-blue-50/30">
                  <td className="p-5 font-black text-slate-700">Lowest Local Price</td>
                  {details.map((prod) => {
                    const lowest = prod.dealers?.[0]?.price || prod.mrp;
                    return (
                      <td key={prod.id} className="p-5 font-black text-base text-slate-900">
                        ₹{lowest.toLocaleString("en-IN")}
                        <span className="block text-[11px] text-slate-400 line-through font-normal">
                          MRP ₹{prod.mrp.toLocaleString("en-IN")}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Best Deal Showroom */}
                <tr>
                  <td className="p-5 font-bold text-slate-500">Best Deal Showroom</td>
                  {details.map((prod) => (
                    <td key={prod.id} className="p-5 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <Store className="w-3.5 h-3.5 shrink-0" />
                        <span>{prod.dealers?.[0]?.showroom?.name || "Check Retailers"}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Warranty */}
                <tr>
                  <td className="p-5 font-bold text-slate-500">Warranty</td>
                  {details.map((prod) => (
                    <td key={prod.id} className="p-5 text-slate-700 font-semibold">
                      {prod.warranty || "1 Year Standard"}
                    </td>
                  ))}
                </tr>

                {/* Energy Rating */}
                <tr>
                  <td className="p-5 font-bold text-slate-500">Energy Rating</td>
                  {details.map((prod) => (
                    <td key={prod.id} className="p-5 text-slate-700 font-semibold">
                      {prod.energyRating || "N/A"}
                    </td>
                  ))}
                </tr>

                {/* Action Link */}
                <tr>
                  <td className="p-5 font-bold text-slate-500">View Dealers</td>
                  {details.map((prod) => (
                    <td key={prod.id} className="p-5">
                      <Link
                        href={`/product/${prod.id}`}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition"
                      >
                        All Showrooms <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}