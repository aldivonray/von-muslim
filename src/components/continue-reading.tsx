"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { useTerakhirDibaca } from "@/lib/use-penanda";

export function ContinueReading({
  surat,
}: {
  surat: { nomor: number; namaLatin: string; jumlahAyat: number }[];
}) {
  const [progress] = useTerakhirDibaca();
  const detail = progress && surat.find((s) => s.nomor === progress.surah);
  if (!progress || !detail) return null;
  const persen = Math.min(
    100,
    Math.round((progress.ayat / detail.jumlahAyat) * 100),
  );

  return (
    <Link
      href={`/quran/${progress.surah}#ayat-${progress.ayat}`}
      className="group animate-rise flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-5"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BookOpenCheck className="size-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-muted-foreground">
          Lanjutkan membaca
        </span>
        <span className="block truncate font-semibold">
          QS. {detail.namaLatin} ayat {progress.ayat}
        </span>
        <span
          className="mt-2 block h-1.5 overflow-hidden rounded-full bg-secondary"
          aria-label={`${persen}% dari surat`}
          role="img"
        >
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${persen}%` }}
          />
        </span>
      </span>
      <ArrowRight
        className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
