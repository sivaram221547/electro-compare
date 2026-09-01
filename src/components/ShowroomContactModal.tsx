"use client";

import React, { useState } from "react";
import { 
  Phone, 
  MessageSquare, 
  Store, 
  MapPin, 
  X, 
  Send, 
  CheckCircle2, 
  FileText 
} from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
  };
  dealer: {
    name: string;
    area: string;
    city: string;
    phone: string;
    price: number;
    activeDeal?: string;
  };
}

export default function ShowroomContactModal({
  isOpen,
  onClose,
  product,
  dealer,
}: ContactModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Best Final Price");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Clean phone number for WhatsApp link (removes non-digits)
  const cleanPhone = dealer.phone.replace(/[^0-9]/g, "");
  
  // Format clean WhatsApp inquiry text
  const message = `Hello ${dealer.name}, I am looking to purchase the "${product.name}" listed on ElectroCompare for ₹${dealer.price.toLocaleString("en-IN")}. Is this model currently in stock at your ${dealer.area} branch?`;
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(message)}`;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{dealer.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" /> {dealer.area}, {dealer.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product & Price Summary Pill */}
        <div className="my-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-2xl">{product.image}</span>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{product.name}</p>
              <p className="text-[10px] text-emerald-600 font-bold">{dealer.activeDeal || "Live Local Offer"}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-slate-900">₹{dealer.price.toLocaleString("en-IN")}</span>
            <span className="text-[10px] text-slate-400 block">Showroom Price</span>
          </div>
        </div>

        {/* Quick Instant Contact Options */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition"
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp Quote
          </a>
          <a
            href={`tel:${dealer.phone}`}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-slate-900/10 transition"
          >
            <Phone className="w-4 h-4 text-emerald-400" /> Direct Call
          </a>
        </div>

        {/* Form to Request Callback / Price Match */}
        <div className="pt-3 border-t border-slate-100">
          <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" /> Request Official Showroom Callback
          </h4>

          {submitted ? (
            <div className="py-6 text-center text-emerald-600 flex flex-col items-center gap-1">
              <CheckCircle2 className="w-8 h-8" />
              <p className="text-xs font-black">Inquiry Sent to Showroom Manager!</p>
              <p className="text-[10px] text-slate-400">They will call you back shortly with store discounts.</p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="Best Final Price">Request Best Final Price (Offline Cash Discount)</option>
                <option value="Exchange Bonus">Check Old Appliance Exchange Bonus</option>
                <option value="EMI Options">Check 0% Interest Bajaj/Credit Card EMI</option>
                <option value="Delivery Schedule">Check Same-Day Home Delivery</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Showroom Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}