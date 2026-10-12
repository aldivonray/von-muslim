"use client";

import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePenanda } from "@/lib/use-penanda";

export function PenandaList({
  surat,
}: {
  surat: { nomor: number; namaLatin: string }[];
}) {
  const { list, toggle } = usePenanda();
  const nama = new Map(surat.map((s) => [s.nomor, s.namaLatin] as const));

  if (list.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed bg-card p-10 text-center">
        <Bookmark className="mx-auto size-10 text-gold" aria-hidden="true" />
        <p className="mt-4 text-muted-foreground">
          Belum ada ayat tersimpan. Buka Al-Qur&apos;an dan ketuk Simpan pada
          ayat yang ingin disimpan.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/quran">Buka Al-Qur&apos;an</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((b) => (
        <li
          key={`${b.surah}:${b.ayat}`}
          className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold-soft/50 text-gold">
            <Bookmark className="size-5" aria-hidden="true" />
          </span>
          <Link
            href={`/quran/${b.surah}#ayat-${b.ayat}`}
            className="min-w-0 flex-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            QS. {nama.get(b.surah) ?? b.surah} ayat {b.ayat}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={`Hapus penanda QS. ${nama.get(b.surah) ?? b.surah} ayat ${b.ayat}`}
            onClick={() => toggle(b.surah, b.ayat)}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
