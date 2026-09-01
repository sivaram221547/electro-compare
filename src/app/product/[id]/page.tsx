"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ShowroomContactModal from "@/components/ShowroomContactModal";
import { useLocation } from "@/context/LocationContext";
import { useCompare } from "@/context/CompareContext";
import { 
  Store, 
  MapPin, 
  Phone, 
  Tag, 
  ShieldCheck, 
  Scale, 
  Check, 
  Loader2,
  TrendingDown,
  Info,
  MessageSquare
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { currentCity } = useLocation();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Contact Modal State
  const [activeContactDealer, setActiveContactDealer] = useState<any | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}?city=${currentCity.name}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, currentCity.name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading showroom comparison matrix...</p>
        </div>
      </div>
    );
  }

  if (!product || product.error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <Info className="w-10 h-10 text-slate-400 mb-3" />
          <h2 className="text-lg font-black text-slate-800">Appliance Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">This appliance is not listed in {currentCity.name}.</p>
        </div>
      </div>
    );
  }

  const inCompare = isInCompare(product.id);
  const lowestPrice = product.dealers.length > 0 ? product.dealers[0].price : product.mrp;
  const maxSavings = product.mrp - lowestPrice;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-32">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Product Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="md:col-span-4 bg-slate-50 rounded-2xl p-8 flex items-center justify-center border border-slate-100 text-6xl select-none">
              {product.image}
            </div>

            {/* Product Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <button
                  onClick={() => {
                    if (inCompare) {
                      removeFromCompare(product.id);
                    } else {
                      addToCompare({
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        image: product.image,
                        lowestPrice: lowestPrice,
                        mrp: product.mrp,
                        bestShowroom: product.dealers[0]?.showroom?.name || "Local Retail",
                        distanceKm: product.dealers[0]?.distanceKm || 1.0,
                      });
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    inCompare
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {inCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                  {inCompare ? "In Compare Tray" : "Add to Compare"}
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-slate-900">
                  ₹{lowestPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-semibold text-slate-400 line-through">
                  MRP ₹{product.mrp.toLocaleString("en-IN")}
                </span>
                {maxSavings > 0 && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Save ₹{maxSavings.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Specs Badges */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                {product.displaySize && (
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Size: {product.displaySize}</span>
                )}
                {product.resolution && (
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">{product.resolution}</span>
                )}
                {product.capacity && (
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Capacity: {product.capacity}</span>
                )}
                {product.energyRating && (
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">{product.energyRating}</span>
                )}
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> {product.warranty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Showroom Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Live Showroom Prices in {currentCity.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Ranked by lowest showroom selling price with verified in-store deals
              </p>
            </div>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
              {product.dealers.length} Showrooms Stocking
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {product.dealers.map((dealer: any, idx: number) => {
              const isBestPrice = idx === 0;

              return (
                <div
                  key={dealer.id}
                  className={`p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                    isBestPrice ? "bg-blue-50/30" : "hover:bg-slate-50/50"
                  }`}
                >
                  {/* Showroom info */}
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${
                      isBestPrice ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}>
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm">
                          {dealer.showroom.name}
                        </h3>
                        {isBestPrice && (
                          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            Lowest Price
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {dealer.showroom.area}, {dealer.showroom.city} ({dealer.distanceKm} km)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Deal */}
                  <div className="sm:text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      <Tag className="w-3 h-3" /> {dealer.activeDeal || "Standard Showroom Warranty"}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      {dealer.inStock ? `In Stock (${dealer.stockCount} left)` : "Backorder available"}
                    </p>
                  </div>

                  {/* Price & Contact Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-xl font-black text-slate-900 block">
                        ₹{dealer.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold line-through">
                        MRP ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setActiveContactDealer({
                          name: dealer.showroom.name,
                          area: dealer.showroom.area,
                          city: dealer.showroom.city,
                          phone: dealer.showroom.phone,
                          price: dealer.price,
                          activeDeal: dealer.activeDeal,
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 shrink-0 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Showroom</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Showroom Contact / WhatsApp Modal */}
      {activeContactDealer && (
        <ShowroomContactModal
          isOpen={!!activeContactDealer}
          onClose={() => setActiveContactDealer(null)}
          product={{
            id: product.id,
            name: product.name,
            image: product.image,
          }}
          dealer={activeContactDealer}
        />
      )}
    </div>
  );
}