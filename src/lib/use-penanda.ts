"use client";

import { useLocalStorage } from "@/lib/use-local-storage";

export type AyatRef = { surah: number; ayat: number };

const isRef = (v: unknown): v is AyatRef =>
  typeof v === "object" &&
  v !== null &&
  Number.isInteger((v as AyatRef).surah) &&
  Number.isInteger((v as AyatRef).ayat);

const isRefList = (v: unknown): v is AyatRef[] =>
  Array.isArray(v) && v.every(isRef);

const isLastRead = (v: unknown): v is AyatRef | null => v === null || isRef(v);

const EMPTY: AyatRef[] = [];

// Stored per device. shortcut: no sync between devices, add an account-backed store if that is needed.
export function usePenanda() {
  const [list, setList] = useLocalStorage(
    "vonmuslim:penanda",
    EMPTY,
    isRefList,
  );
  const has = (surah: number, ayat: number) =>
    list.some((b) => b.surah === surah && b.ayat === ayat);
  function toggle(surah: number, ayat: number) {
    setList(
      has(surah, ayat)
        ? list.filter((b) => !(b.surah === surah && b.ayat === ayat))
        : [...list, { surah, ayat }].sort(
            (a, b) => a.surah - b.surah || a.ayat - b.ayat,
          ),
    );
  }
  return { list, has, toggle };
}

export function useTerakhirDibaca() {
  return useLocalStorage<AyatRef | null>(
    "vonmuslim:terakhir",
    null,
    isLastRead,
  );
}
