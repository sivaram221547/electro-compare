"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  Store, 
  Package, 
  TrendingUp, 
  Tag, 
  Edit3, 
  Check, 
  RefreshCw, 
  Save,
  Plus,
  X,
  PlusCircle,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";

interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  mrp: number;
  price: number;
  inStock: boolean;
  stockCount: number;
  activeDeal: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  mrp: number;
}

export default function ShowroomDashboard() {
  const router = useRouter();
  const [showroomInfo, setShowroomInfo] = useState({
    id: "shw-pai-kurnool",
    name: "Pai International",
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDeal, setEditDeal] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newDeal, setNewDeal] = useState("");
  const [newStockCount, setNewStockCount] = useState<number>(5);

  useEffect(() => {
    const savedId = localStorage.getItem("active_showroom_id") || "shw-pai-kurnool";
    const savedName = localStorage.getItem("active_showroom_name") || "Pai International";
    setShowroomInfo({ id: savedId, name: savedName });
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const activeId = localStorage.getItem("active_showroom_id") || "shw-pai-kurnool";
      const res = await fetch(`/api/showroom/stock?showroomId=${activeId}`);
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory);
        setCatalog(data.availableCatalog || []);
        if (data.availableCatalog && data.availableCatalog.length > 0) {
          setSelectedProductId(data.availableCatalog[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [showroomInfo.id]);

  const handleStartEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditDeal(item.activeDeal === "No active offer" ? "" : item.activeDeal);
  };

  const handleSaveStock = async (stockId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/showroom/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockId,
          price: editPrice,
          activeDeal: editDeal || "No active offer",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === stockId
              ? { ...item, price: editPrice, activeDeal: editDeal || "No active offer" }
              : item
          )
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save stock update", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStock = async (item: InventoryItem) => {
    const updatedStatus = !item.inStock;
    try {
      await fetch("/api/showroom/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockId: item.id,
          inStock: updatedStatus,
        }),
      });

      setInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, inStock: updatedStatus } : i))
      );
    } catch (err) {
      console.error("Failed to toggle in-stock status", err);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !newPrice) return;

    setIsSaving(true);
    try {
      const activeId = localStorage.getItem("active_showroom_id") || "shw-pai-kurnool";
      const res = await fetch("/api/showroom/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showroomId: activeId,
          productId: selectedProductId,
          price: Number(newPrice),
          activeDeal: newDeal || "Special In-Store Offer",
          stockCount: Number(newStockCount),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewPrice("");
        setNewDeal("");
        fetchStock();
      }
    } catch (err) {
      console.error("Failed to add product", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("active_showroom_id");
    localStorage.removeItem("active_showroom_name");
    router.push("/showroom/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 text-2xl">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{showroomInfo.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Partner Portal • Real-Time Stock Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={fetchStock}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Refresh inventory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-2.5 rounded-xl border border-red-500/20 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Live Showroom Models</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{inventory.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Ready in Stock</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">
              {inventory.filter((i) => i.inStock).length} Units
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Active Deals Running</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {inventory.filter((i) => i.activeDeal !== "No active offer").length}
            </p>
          </div>
        </div>

        {/* Inventory Control Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Manage Appliance Stock & Pricing</h2>
              <p className="text-xs text-slate-400 font-medium">
                Changes saved here reflect instantly on the shopper price comparison matrices
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3.5 px-6">Appliance</th>
                  <th className="py-3.5 px-6">Official MRP</th>
                  <th className="py-3.5 px-6">Your Showroom Price</th>
                  <th className="py-3.5 px-6">Active Offer / Deal</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                      No appliances added yet. Click &quot;Add Product&quot; to add models to your inventory.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const isEditing = editingId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl">{item.image}</span>
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">
                              {item.category}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-400 font-semibold line-through">
                          ₹{item.mrp.toLocaleString("en-IN")}
                        </td>

                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-28 px-2.5 py-1.5 bg-slate-50 border border-blue-500 rounded-lg text-xs font-black text-slate-900 outline-none"
                            />
                          ) : (
                            <span className="font-black text-slate-900 text-sm">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editDeal}
                              placeholder="e.g. Free 10-Yr Warranty"
                              onChange={(e) => setEditDeal(e.target.value)}
                              className="w-48 px-2.5 py-1.5 bg-slate-50 border border-blue-500 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <Tag className="w-3 h-3" /> {item.activeDeal}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleStock(item)}
                            className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition cursor-pointer ${
                              item.inStock
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          {isEditing ? (
                            <button
                              disabled={isSaving}
                              onClick={() => handleSaveStock(item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ml-auto shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="text-slate-600 hover:text-blue-600 p-1.5 hover:bg-slate-100 rounded-lg transition ml-auto flex items-center gap-1 text-xs font-bold cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Add Appliance to Your Showroom
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Appliance Model
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = catalog.find((c) => c.id === e.target.value);
                    if (prod) setNewPrice(prod.mrp - 2000);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                >
                  {catalog.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (MRP: ₹{c.mrp.toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Showroom Selling Price (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 24490"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active Promotion / Offer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free 10-Yr Warranty, 5% Cashback"
                  value={newDeal}
                  onChange={(e) => setNewDeal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Adding..." : "Add to Live Showroom Inventory"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}