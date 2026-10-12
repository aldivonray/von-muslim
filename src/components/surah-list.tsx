"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { SurahSummary } from "@/lib/content-api";
import { NomorBadge } from "@/components/nomor-badge";
import { Label } from "@/components/ui/label";

// Ignore dashes and apostrophes so "al-fatihah" finds "Al Fatihah".
const normalize = (value: string) =>
  value.toLowerCase().replace(/[-'’]/g, "").replace(/\s+/g, " ").trim();

// Surat yang paling sering dicari untuk dibaca rutin.
const POPULER = [1, 18, 36, 55, 56, 67];

export function SurahList({ surat }: { surat: SurahSummary[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return surat;
    return surat.filter((s) =>
      [String(s.nomor), s.namaLatin, s.arti].some((field) =>
        normalize(field).includes(q),
      ),
    );
  }, [query, surat]);

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
        <Label htmlFor={inputId} className="sr-only">
          Cari surat
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari surat: Yasin, Al-Kahf, atau 36"
            className="h-12 w-full rounded-full border bg-background pr-4 pl-12 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
          />
        </div>
        {!query && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Populer:
            </span>
            {POPULER.map((nomor) => (
              <Link
                key={nomor}
                href={`/quran/${nomor}`}
                className="rounded-full bg-secondary px-3 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {surat[nomor - 1]?.namaLatin}
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {query ? `${filtered.length} surat ditemukan` : "114 surat"}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
          Surat tidak ditemukan.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.nomor}>
              <Link
                href={`/quran/${s.nomor}`}
                className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-ring"
              >
                <NomorBadge
                  n={s.nomor}
                  className="transition-colors group-hover:text-gold"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{s.namaLatin}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {s.arti}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {s.tempatTurun} · {s.jumlahAyat} ayat
                  </span>
                </span>
                <span
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-2xl text-primary"
                >
                  {s.nama}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
