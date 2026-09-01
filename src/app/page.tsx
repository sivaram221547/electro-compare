"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useLocation } from "@/context/LocationContext";
import { 
  Search, 
  Tv, 
  Refrigerator, 
  Wind, 
  WashingMachine, 
  MapPin, 
  ArrowRight,
  Loader2
} from "lucide-react";

export default function Home() {
  const { currentCity } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "All Appliances", icon: <Tv className="w-4 h-4" /> },
    { id: "Smart TVs", name: "Smart TVs", icon: <Tv className="w-4 h-4" /> },
    { id: "Refrigerators", name: "Refrigerators", icon: <Refrigerator className="w-4 h-4" /> },
    { id: "Air Conditioners", name: "Air Conditioners", icon: <Wind className="w-4 h-4" /> },
    { id: "Washing Machines", name: "Washing Machines", icon: <WashingMachine className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchLiveProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          city: currentCity.name,
          category: selectedCategory,
        });
        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProducts();
  }, [currentCity.name, selectedCategory]);

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-blue-300 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Comparing Live Prices in <strong>{currentCity.name}, {currentCity.state}</strong></span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Compare Local Electronics Prices. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
              Save Big Before You Walk In.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Search top retail showrooms (Pai, Bajaj, Reliance, Lotus) across {currentCity.name}. 
            Check live inventory, compare exclusive discounts, and grab offline deals.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search TVs, ACs, Refrigerators (e.g. Samsung 55, LG)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm outline-none font-medium"
              />
            </div>
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery)}`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0"
            >
              Search Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32 w-full flex-1">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Featured Local Deals</h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time lowest prices from registered showrooms near {currentCity.name}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {filteredProducts.length} items found
          </span>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-xs font-bold text-slate-500">Fetching live showroom stock...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
            <p className="text-sm font-bold text-slate-600">No appliances found for this filter or city.</p>
            <p className="text-xs text-slate-400 mt-1">Try switching categories or cities using the top dropdown.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}