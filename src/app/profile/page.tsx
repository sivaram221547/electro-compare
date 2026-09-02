"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  Scale,
  Clock,
  Bell,
  Star,
  BookOpen,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Edit3,
  BadgeCheck,
  MapPin,
  Calendar,
  Store,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  pincode?: string;
  createdAt?: string;
  image?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch (e) {
      console.error(e);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const initialLetter = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-800 font-medium">My Profile</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <User size={18} /> My Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ShoppingBag size={18} /> My Orders / Inquiries
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Heart size={18} /> Wishlist
            </button>
            <button
              onClick={() => setActiveTab("comparisons")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Scale size={18} /> Comparisons
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Clock size={18} /> Recently Viewed
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Bell size={18} /> Price Alerts
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Star size={18} /> Reviews & Ratings
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <BookOpen size={18} /> Address Book
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Settings size={18} /> Notification Settings
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ShieldCheck size={18} /> Privacy & Security
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <HelpCircle size={18} /> Help & Support
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Partner With Us Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
            <h4 className="font-semibold text-slate-900 text-sm">Partner With Us</h4>
            <p className="text-xs text-slate-500 mt-1">
              Are you a showroom owner? List your store and reach thousands of customers.
            </p>
            <Link
              href="/showroom/register"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 mt-3 hover:underline"
            >
              Register Your Showroom <ArrowRight size={14} />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Header Title & Edit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500">Manage your account information and preferences</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-3xl flex items-center justify-center ring-4 ring-white shadow-md select-none">
                  {initialLetter}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {user?.name || "Customer User"}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    <BadgeCheck size={14} /> Verified User
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  <span>{user?.phone || "+91 98765 43210"}</span>
                  <span>•</span>
                  <span>{user?.email || "customer@example.com"}</span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} /> {user?.city || "Hyderabad, Telangana - 500001"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} /> Joined Recently
                  </span>
                </div>
              </div>
            </div>

            {/* Loyal Customer Badge */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Loyal Customer</p>
                <p className="text-[11px] text-slate-500">Keep comparing and saving!</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Orders / Inquiries", count: 12, color: "text-blue-600" },
              { label: "Wishlist Items", count: 18, color: "text-rose-500" },
              { label: "Comparisons", count: 7, color: "text-emerald-500" },
              { label: "Price Alerts", count: 3, color: "text-amber-500" },
              { label: "Reviews Given", count: 9, color: "text-purple-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-[11px] text-slate-500 mt-1">{stat.label}</p>
                <button className="text-[10px] text-blue-600 font-semibold mt-2 hover:underline">
                  View all
                </button>
              </div>
            ))}
          </div>

          {/* Two Columns: Recent Activity & Saved Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
                <button className="text-xs text-blue-600 hover:underline">View All</button>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { text: "Viewed Samsung 55 inch Crystal 4K UHD Smart TV", time: "2 hours ago" },
                  { text: "Contacted Giri Electronics about LG 260L Refrigerator", time: "1 day ago" },
                  { text: "Added Whirlpool 7.5 Kg Top Load to Wishlist", time: "2 days ago" },
                  { text: "Compared 3 AC models in Guntur", time: "3 days ago" },
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-slate-700 truncate pr-2">{act.text}</span>
                    <span className="text-slate-400 whitespace-nowrap text-[11px]">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Wishlist Items */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Saved Wishlist Items</h3>
                <button className="text-xs text-blue-600 hover:underline">View Wishlist</button>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { name: "Samsung 55 inch Crystal 4K UHD", price: "₹49,999", showrooms: "5 Showrooms" },
                  { name: "LG 260L Double Door Refrigerator", price: "₹27,490", showrooms: "6 Showrooms" },
                  { name: "Whirlpool 7.5 Kg Top Load", price: "₹17,990", showrooms: "4 Showrooms" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-400">{item.showrooms}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{item.price}</p>
                      <button className="text-[11px] text-blue-600 hover:underline">View Prices</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © {currentYear} ElectroCompare. All rights reserved.
      </footer>
    </div>
  );
}