import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SurahReader } from "@/components/surah-reader";
import { getSurah } from "@/lib/content-api";
import { stripHtml } from "@/lib/html";

type Props = { params: Promise<{ nomor: string }> };

async function parseNomor(params: Props["params"]) {
  const { nomor: raw } = await params;
  const nomor = Number(raw);
  if (!/^\d+$/.test(raw) || nomor < 1 || nomor > 114) notFound();
  return nomor;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const surah = await getSurah(await parseNomor(params));
  return { title: `${surah.namaLatin} (${surah.arti})` };
}

export default async function SurahPage({ params }: Props) {
  const nomor = await parseNomor(params);
  const surah = await getSurah(nomor);

  // Bismillah is the first ayat of Al-Fatihah, read from the API and never typed by hand.
  // Al-Fatihah (1) already contains it as ayat 1; At-Taubah (9) has none.
  const bismillah =
    nomor === 1 || nomor === 9 ? null : (await getSurah(1)).ayat[0].teksArab;

  const deskripsi = stripHtml(surah.deskripsi);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Surat ke-${surah.nomor}`}
        title={`${surah.nomor}. ${surah.namaLatin}`}
        description={surah.arti}
        centered
      >
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic mt-6 text-5xl leading-[1.6] text-gold-soft sm:text-6xl"
        >
          {surah.nama}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
          {[surah.tempatTurun, `${surah.jumlahAyat} ayat`].map((info) => (
            <li
              key={info}
              className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15"
            >
              {info}
            </li>
          ))}
        </ul>
        {deskripsi && (
          <details className="group mx-auto mt-6 max-w-2xl text-left">
            <summary className="mx-auto flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-gold-soft hover:bg-white/10 [&::-webkit-details-marker]:hidden">
              <Info className="size-4" aria-hidden="true" />
              Tentang surat ini
            </summary>
            <p className="mt-4 rounded-2xl bg-black/15 p-5 text-sm leading-7 whitespace-pre-line text-white/85">
              {deskripsi}
            </p>
          </details>
        )}
      </PageHeader>

      <SurahReader
        surah={surah.nomor}
        namaLatin={surah.namaLatin}
        ayat={surah.ayat}
        audioFull={surah.audioFull}
        bismillah={bismillah}
      />

      <nav
        aria-label="Navigasi surat"
        className="mx-auto grid max-w-3xl grid-cols-2 gap-3"
      >
        {surah.suratSebelumnya ? (
          <Link
            href={`/quran/${surah.suratSebelumnya.nomor}`}
            className="group rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Sebelumnya
            </span>
            <span className="mt-1 block font-bold text-primary">
              {surah.suratSebelumnya.namaLatin}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {surah.suratSelanjutnya ? (
          <Link
            href={`/quran/${surah.suratSelanjutnya.nomor}`}
            className="group rounded-2xl border bg-card p-4 text-right transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Selanjutnya
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
            <span className="mt-1 block font-bold text-primary">
              {surah.suratSelanjutnya.namaLatin}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
