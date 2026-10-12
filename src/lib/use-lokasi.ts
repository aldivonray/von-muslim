"use client";

import { kotaPilihan, type Lokasi } from "@/data/kota";
import { useLocalStorage } from "@/lib/use-local-storage";

function isLokasi(value: unknown): value is Lokasi {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.label === "string" &&
    typeof v.latitude === "number" &&
    typeof v.longitude === "number"
  );
}

export function useLokasi() {
  return useLocalStorage<Lokasi>("vonmuslim:lokasi", kotaPilihan[0], isLokasi);
}
