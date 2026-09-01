"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CityOption {
  id: string;
  name: string;
  state: string;
  popularAreas: string[];
}

export const SUPPORTED_CITIES: CityOption[] = [
  {
    id: "ongole",
    name: "Ongole",
    state: "AP",
    popularAreas: ["Kurnool Road", "Trunk Road", "Lawyerpet", "Court Center"],
  },
  {
    id: "guntur",
    name: "Guntur",
    state: "AP",
    popularAreas: ["Arundelpet", "Brodipet", "Lakshmipuram", "Nazerpet"],
  },
  {
    id: "vijayawada",
    name: "Vijayawada",
    state: "AP",
    popularAreas: ["MG Road", "Benz Circle", "Governorpet", "One Town"],
  },
  {
    id: "nellore",
    name: "Nellore",
    state: "AP",
    popularAreas: ["Pogathota", "Trunk Road", "Magunta Layout", "VRC Centre"],
  },
];

interface LocationContextType {
  currentCity: CityOption;
  setCityById: (cityId: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentCity, setCurrentCity] = useState<CityOption>(SUPPORTED_CITIES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("electro_selected_city");
    if (saved) {
      const match = SUPPORTED_CITIES.find((c) => c.id === saved);
      if (match) setCurrentCity(match);
    }
  }, []);

  const setCityById = (cityId: string) => {
    const found = SUPPORTED_CITIES.find((c) => c.id === cityId);
    if (found) {
      setCurrentCity(found);
      localStorage.setItem("electro_selected_city", found.id);
    }
  };

  return (
    <LocationContext.Provider value={{ currentCity, setCityById }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}