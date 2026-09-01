"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CompareProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  lowestPrice: number;
  mrp: number;
  bestShowroom: string;
  distanceKm: number;
}

interface CompareContextType {
  compareItems: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<CompareProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("electro_compare_items");
    if (saved) {
      try {
        setCompareItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved comparisons", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("electro_compare_items", JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product: CompareProduct) => {
    // Limit removed! Users can add as many as they want.
    if (!compareItems.some((item) => item.id === product.id)) {
      setCompareItems((prev) => [...prev, product]);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (id: string) => {
    return compareItems.some((item) => item.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}