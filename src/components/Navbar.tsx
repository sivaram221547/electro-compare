"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Scale, 
  Store, 
  User, 
  ChevronDown,
  ShoppingBag,
  Headphones,
  X,
  Search,
  Check,
  Building2
} from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useLocation, SUPPORTED_CITIES } from "@/context/LocationContext";

export default function Navbar() {
  const { compareItems } = useCompare();
  const { currentCity, setCityById } = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const filteredCities = SUPPORTED_CITIES.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    city.popularAreas.some((area) => area.toLowerCase().includes(citySearch.toLowerCase()))
  );

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        {/* Top Notice Banner */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              Comparing local showrooms in:{" "}
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="text-white font-bold underline hover:text-blue-300 transition inline-flex items-center gap-1"
              >
                {currentCity.name}, {currentCity.state}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link 
              href="/showroom/register" 
              className="hover:text-white transition flex items-center gap-1 font-semibold text-amber-400"
            >
              <Store className="w-3 h-3" /> Are you a Showroom Owner? Partner with us
            </Link>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Headphones className="w-3 h-3 text-emerald-400" /> Support: 1800-LOCAL-DEAL
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                Electro<span className="text-blue-600">Compare</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase block -mt-0.5">
                Compare Prices. Save More.
              </span>
            </div>
          </Link>

          {/* Premium Custom Location Trigger Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 transition shadow-2xs group cursor-pointer"
          >
            <div className="p-1 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span>{currentCity.name}, {currentCity.state}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
          </button>

          {/* Right Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Compare Button */}
            <Link
              href="/compare"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
            >
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Compare</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {compareItems.length}
              </span>
            </Link>

            {/* Showroom Partner Portal Link */}
            <Link
              href="/showroom/dashboard"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 rounded-xl hover:bg-emerald-100 transition"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Showroom Portal</span>
            </Link>

            {/* User Sign In */}
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Modern City Selection Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Select Your City
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Showing real-time showroom pricing and stock near you
                </p>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Cities */}
            <div className="py-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 focus-within:bg-white transition">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city or area (e.g. Ongole, Trunk Road)..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="bg-transparent text-xs w-full outline-none font-semibold text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* City Cards Grid */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = currentCity.id === city.id;

                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      setCityById(city.id);
                      setIsLocationModalOpen(false);
                      setCitySearch("");
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-start justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/10"
                        : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          {city.name}, {city.state}
                        </span>
                        {isSelected && (
                          <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                            Active City
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Popular hubs: {city.popularAreas.join(" • ")}
                      </p>
                    </div>

                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                    }`}>
                      <Check className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}