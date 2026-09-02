"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import StoreMapModal from "@/components/StoreMapModal";
import { useLocation } from "@/context/LocationContext";
import { Search, SlidersHorizontal, Loader2, MapPin } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { currentCity } = useLocation();

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"lowest" | "distance" | "rating">("lowest");

  // Map Modal State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchSearchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?city=${currentCity.name}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchData();
  }, [currentCity.name]);

  const filtered = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "lowest") return a.lowestPrice - b.lowestPrice;
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleOpenMap = (product: any) => {
    setSelectedProduct(product);
    setIsMapModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 w-full flex-1">
        {/* Search Header Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search appliances..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-xs outline-none w-full font-semibold text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="lowest">Lowest Showroom Price</option>
              <option value="distance">Nearest Showroom</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Result Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-xs font-bold text-slate-500">Searching showroom inventories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
            <p className="text-sm font-bold text-slate-700">No appliances matching &quot;{query}&quot;</p>
            <p className="text-xs text-slate-400 mt-1">Try another search keyword or switch cities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => handleOpenMap(product)}
                className="cursor-pointer group flex flex-col transition-all duration-200 hover:-translate-y-1"
              >
                <ProductCard product={product} />

                {/* Visual Map Action Trigger */}
                <button
                  type="button"
                  className="mt-2.5 w-full py-2.5 px-3 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-blue-200/60 shadow-xs cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Showroom Map ({product.distanceKm || "2.4"} km away)</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Showroom Map Popup Modal */}
      <StoreMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        product={selectedProduct}
        currentCityName={currentCity.name}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}