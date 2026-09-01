"use client";

import React, { useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { Scale, X, ArrowRight, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CompareTray() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  if (compareItems.length === 0 || pathname === "/compare") return null;

  // Minimized Floating Pill Badge (Bottom Right)
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-90 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-slate-900/95 hover:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 transition cursor-pointer group"
        >
          <div className="p-1.5 bg-blue-600 rounded-lg group-hover:scale-110 transition">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <span className="text-xs font-black block leading-none">Compare ({compareItems.length})</span>
            <span className="text-[10px] text-blue-400 font-semibold">Click to expand</span>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
        </button>
      </div>
    );
  }

  // Expanded Dock
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-5xl bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 transition-all duration-300 animate-in slide-in-from-bottom">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Info & Minimize Control */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl hidden sm:block">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black">Compare Tray</h4>
              <p className="text-[11px] text-slate-400 font-medium">
                {compareItems.length} appliance{compareItems.length !== 1 ? "s" : ""} added
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
              title="Minimize bar to see products"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide</span>
            </button>

            <button
              onClick={clearCompare}
              className="sm:hidden text-slate-400 hover:text-red-400 text-xs font-bold px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Selected Items Previews */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 flex-1 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-2 flex items-center gap-2 relative group min-w-[140px] max-w-[180px] shrink-0"
            >
              <span className="text-lg">{item.image}</span>
              <div className="text-left overflow-hidden">
                <p className="text-[10px] font-bold truncate text-slate-200">
                  {item.name}
                </p>
                <p className="text-[10px] font-black text-blue-400 mt-0.5">
                  ₹{item.lowestPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="absolute -top-1.5 -right-1.5 bg-slate-700 hover:bg-red-500 text-white rounded-full p-0.5 shadow-sm transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-slate-700 sm:border-0">
          <button
            onClick={clearCompare}
            className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-red-400 text-xs font-bold px-2 py-1 transition"
            title="Clear all comparison items"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/compare"
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition"
          >
            Compare Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}