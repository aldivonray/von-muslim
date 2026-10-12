import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { AyatCard } from "@/components/ayat-card";
import { PageHeader } from "@/components/page-header";
import { ayatPilihan } from "@/data/ayat-pilihan";
import { getSurah } from "@/lib/content-api";

export const metadata: Metadata = { title: "Ayat Pilihan" };

const anchor = (item: (typeof ayatPilihan)[number]) =>
  `pilihan-${item.surah}-${item.dari}`;

export default async function AyatPilihanPage() {
  const nomorSurat = [...new Set(ayatPilihan.map((item) => item.surah))];
  const surat = new Map(
    await Promise.all(
      nomorSurat.map(async (nomor) => [nomor, await getSurah(nomor)] as const),
    ),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Sparkles}
        eyebrow="Penguat hati"
        title="Ayat Pilihan"
        description="Ayat-ayat yang sering dibaca untuk menguatkan hati, menumbuhkan harapan, dan mengingat Allah."
      />
      <nav aria-label="Tema ayat" className="flex flex-wrap gap-2">
        {ayatPilihan.map((item) => (
          <a
            key={anchor(item)}
            href={`#${anchor(item)}`}
            className="rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            {item.judul}
          </a>
        ))}
      </nav>
      <div className="mx-auto max-w-3xl space-y-6">
        {ayatPilihan.map((item) => {
          const detail = surat.get(item.surah);
          if (!detail) return null;
          return (
            <AyatCard
              key={anchor(item)}
              id={anchor(item)}
              surahNama={detail.namaLatin}
              surah={item.surah}
              judul={item.judul}
              ayat={detail.ayat.slice(item.dari - 1, item.sampai)}
            />
          );
        })}
      </div>
    </div>
  );
}
