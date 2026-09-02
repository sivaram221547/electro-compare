"use client";

import React from "react";
import { X, MapPin, Navigation, Store, ExternalLink, Phone } from "lucide-react";

interface StoreMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    lowestPrice?: number | string;
    showroomName?: string;
    address?: string;
    distanceKm?: number | string;
    phone?: string;
  } | null;
  currentCityName: string;
}

export default function StoreMapModal({ isOpen, onClose, product, currentCityName }: StoreMapModalProps) {
  if (!isOpen || !product) return null;

  const store = product.showroomName || "Local Partner Showroom";
  const address = product.address || `${currentCityName}, Andhra Pradesh`;
  const encodedAddress = encodeURIComponent(`${store}, ${address}`);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Store className="w-3.5 h-3.5" /> {store}
              </span>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                📍 {product.distanceKm || "2.1"} km away
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-1">{product.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {address}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Interactive Map Iframe */}
        <div className="w-full h-80 bg-slate-100 relative">
          <iframe
            title="Store Location"
            src={mapEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Live Showroom Price</p>
            <p className="text-xl font-black text-slate-900">
              ₹{Number(product.lowestPrice || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {product.phone && (
              <a
                href={`tel:${product.phone}`}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Call Store
              </a>
            )}
            
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}