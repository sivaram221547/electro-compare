"use client";

import React from "react";
import { CompareProvider } from "@/context/CompareContext";
import { LocationProvider } from "@/context/LocationContext";
import CompareTray from "@/components/CompareTray";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <CompareProvider>
        {children}
        <CompareTray />
      </CompareProvider>
    </LocationProvider>
  );
}