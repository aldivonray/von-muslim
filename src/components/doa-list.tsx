"use client";

import { ChevronDown, Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { Doa } from "@/lib/content-api";
import { Label } from "@/components/ui/label";

export function DoaList({ doa }: { doa: Doa[] }) {
  const [query, setQuery] = useState("");
  const [grup, setGrup] = useState("Semua");
  const searchId = useId();
  const groupId = useId();

  const groups = useMemo(
    () => [...new Set(doa.map((d) => d.grup))],
    [doa],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doa.filter(
      (d) =>
        (grup === "Semua" || d.grup === grup) &&
        (!q ||
          [d.nama, d.idn, d.grup].some((field) =>
            field.toLowerCase().includes(q),
          )),
    );
  }, [doa, query, grup]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:grid-cols-[1.4fr_1fr] sm:p-6">
        <div className="space-y-1.5">
          <Label htmlFor={searchId} className="text-xs text-muted-foreground">
            Cari doa
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Contoh: makan, tidur, ilmu"
              className="h-12 w-full rounded-full border bg-background pr-4 pl-12 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={groupId} className="text-xs text-muted-foreground">
            Kategori
          </Label>
          <select
            id={groupId}
            value={grup}
            onChange={(event) => setGrup(event.target.value)}
            className="h-12 w-full rounded-full border bg-background px-4 text-sm font-medium"
          >
            <option value="Semua">Semua kategori</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} doa
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
          Doa tidak ditemukan.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {filtered.map((d) => (
            <li key={d.id} className="wrap-break-word">
              <details className="group rounded-2xl border bg-card shadow-sm transition-shadow open:shadow-md">
                <summary className="flex items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-gold">
                      {d.grup}
                    </span>
                    <span className="mt-0.5 block font-bold">{d.nama}</span>
                  </span>
                  <ChevronDown
                    className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t px-5 pt-5 pb-6">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic text-right text-3xl leading-[2.2]"
                  >
                    {d.ar}
                  </p>
                  <p className="mt-4 text-sm leading-6 italic text-primary/80">
                    {d.tr}
                  </p>
                  <p className="mt-3 border-l-2 border-gold/60 pl-4 leading-7">
                    {d.idn}
                  </p>
                  {d.tentang && (
                    <p className="mt-4 rounded-xl bg-muted p-4 text-sm leading-6 whitespace-pre-line text-muted-foreground">
                      {d.tentang}
                    </p>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
