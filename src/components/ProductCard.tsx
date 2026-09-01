"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Tag, Star, Store, Scale, Check } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  lowestPrice: number;
  mrp: number;
  bestDealShowroom: string;
  distanceKm: number;
  dealType: string;
  totalShowrooms: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(product.id);

  const discountPercent = Math.round(
    ((product.mrp - product.lowestPrice) / product.mrp) * 100
  );

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        lowestPrice: product.lowestPrice,
        mrp: product.mrp,
        bestShowroom: product.bestDealShowroom,
        distanceKm: product.distanceKm,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500/80 hover:shadow-xl hover:shadow-blue-500/5 transition duration-300 flex flex-col overflow-hidden group">
      {/* Product Image & Badges */}
      <div className="relative bg-slate-50 p-6 flex items-center justify-center h-48 border-b border-slate-100">
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
          {discountPercent}% OFF
        </span>
        <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Tag className="w-3 h-3" /> {product.dealType}
        </span>
        
        <div className="w-32 h-32 flex items-center justify-center text-4xl group-hover:scale-105 transition duration-300 select-none">
          {product.image}
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span>{product.category}</span>
            <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400" />
              {product.rating} <span className="text-slate-400">({product.reviewsCount})</span>
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-blue-600 transition leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">
              ₹{product.lowestPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Showroom Details */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1 text-slate-600 truncate max-w-[140px]">
                <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{product.bestDealShowroom}</span>
              </span>
              <span className="flex items-center gap-0.5 text-emerald-600 shrink-0">
                <MapPin className="w-3 h-3" />
                {product.distanceKm} km away
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Available in <strong>{product.totalShowrooms}</strong> local showrooms
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={toggleCompare}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center shrink-0 ${
              inCompare
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
            title={inCompare ? "Remove from comparison" : "Add to comparison"}
          >
            {inCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </button>

          <Link
            href={`/product/${product.id}`}
            className="flex-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            Compare Showrooms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}