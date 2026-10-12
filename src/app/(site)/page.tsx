import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Info } from "lucide-react";
import { AyatCard } from "@/components/ayat-card";
import { ContinueReading } from "@/components/continue-reading";
import { NomorBadge } from "@/components/nomor-badge";
import { SectionHeading } from "@/components/page-header";
import { PrayerTimes } from "@/components/prayer-times";
import { Button } from "@/components/ui/button";
import { navItems } from "@/config/nav";
import { ayatPilihan } from "@/data/ayat-pilihan";
import { getAsmaulHusna, getDoaList, getSurah, getSurahList } from "@/lib/content-api";
import { hariIni } from "@/lib/hari-ini";

export const metadata: Metadata = { title: "Beranda" };

const linkPanah =
  "group inline-flex items-center gap-1 text-sm font-semibold text-primary";

export default async function HomePage() {
  const hari = hariIni();
  const pilihan = ayatPilihan[hari.indeks % ayatPilihan.length];
  // A failing source hides its card; the rest of the home page still renders.
  const [surat, asmaul, doa, daftarSurat] = await Promise.all([
    getSurah(pilihan.surah).catch(() => null),
    getAsmaulHusna().catch(() => null),
    getDoaList().catch(() => null),
    getSurahList().catch(() => []),
  ]);
  const asmaHariIni = asmaul?.[hari.indeks % asmaul.length];
  const doaHariIni = doa?.[hari.indeks % doa.length];

  return (
    <div className="space-y-14 sm:space-y-20">
      <section className="surface-hero relative isolate overflow-hidden rounded-[2rem] px-6 py-10 text-white shadow-xl shadow-primary/10 sm:px-12 sm:py-14">
        <div
          aria-hidden="true"
          className="bg-pattern-light absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black,transparent_90%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-gold/25 blur-3xl"
        />
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-rise">
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-white/10 px-3.5 py-1.5 text-xs text-white/85 ring-1 ring-white/15 sm:rounded-full">
              <CalendarDays className="size-3.5 text-gold-soft" aria-hidden="true" />
              <span>{hari.masehi}</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>{hari.hijriah}</span>
            </p>
            <p className="mt-7 text-sm font-semibold tracking-[0.2em] text-gold-soft uppercase">
              Assalamu&rsquo;alaikum
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              Mengenal Islam
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-pretty text-white/80">
              Baca Al-Qur&apos;an dengan audio murottal, jaga waktu shalat, dan
              pelajari doa harian. Semuanya di satu tempat yang tenang.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-gold-soft px-6 text-deep hover:bg-white"
              >
                <Link href="/quran">
                  <BookOpen aria-hidden="true" />
                  Baca Al-Qur&apos;an
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/pengenalan">
                  <Info aria-hidden="true" />
                  Kenali Islam
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {[
                ["114", "Surat"],
                [String(doa?.length ?? 227), "Doa harian"],
                [String(asmaul?.length ?? 99), "Asmaul Husna"],
              ].map(([angka, label]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="text-2xl font-bold tabular-nums">{angka}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <PrayerTimes compact />
          </div>
        </div>
      </section>

      <ContinueReading surat={daftarSurat} />

      <section aria-labelledby="hari-ini">
        <SectionHeading id="hari-ini" eyebrow="Renungan" title="Hari ini untukmu" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {surat ? (
              <AyatCard
                className="h-full"
                surahNama={surat.namaLatin}
                surah={pilihan.surah}
                judul={`Ayat hari ini · ${pilihan.judul}`}
                ayat={surat.ayat.slice(pilihan.dari - 1, pilihan.sampai)}
              />
            ) : (
              <p className="rounded-3xl border bg-card p-6 text-muted-foreground">
                Ayat hari ini belum bisa dimuat.
              </p>
            )}
          </div>
          <div className="grid gap-6">
            {asmaHariIni && (
              <article className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
                <div
                  aria-hidden="true"
                  className="bg-pattern absolute inset-0 [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                      Asmaul Husna hari ini
                    </h3>
                    <NomorBadge n={asmaHariIni.id} />
                  </div>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic mt-4 text-center text-5xl leading-[1.6] text-primary"
                  >
                    {asmaHariIni.arab}
                  </p>
                  <p className="mt-3 text-center text-lg font-bold">
                    {asmaHariIni.latin}
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    {asmaHariIni.indo}
                  </p>
                  <Link href="/asmaul-husna" className={`${linkPanah} mt-5`}>
                    Lihat 99 nama
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            )}
            {doaHariIni && (
              <article className="rounded-3xl border bg-card p-6 shadow-sm">
                <h3 className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                  Doa hari ini
                </h3>
                <p className="mt-2 font-bold">{doaHariIni.nama}</p>
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic mt-4 text-right text-2xl leading-[2]"
                >
                  {doaHariIni.ar}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {doaHariIni.idn}
                </p>
                <Link href="/doa" className={`${linkPanah} mt-5`}>
                  Doa lainnya
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="jelajahi">
        <SectionHeading id="jelajahi" eyebrow="Fitur" title="Jelajahi VonMuslim" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {navItems
            .filter((item) => item.href !== "/")
            .map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-3xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="mt-5 font-bold">{item.label}</span>
                    <span className="mt-1.5 flex-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </span>
                    <ArrowRight
                      className="mt-4 size-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
