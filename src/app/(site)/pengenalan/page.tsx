import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Info, Quote } from "lucide-react";
import { NomorBadge } from "@/components/nomor-badge";
import { PageHeader, SectionHeading } from "@/components/page-header";
import {
  ihsan,
  rukunIman,
  rukunIslam,
  syahadat,
  type Pokok,
} from "@/data/pengenalan";

export const metadata: Metadata = { title: "Pengenalan Islam" };

const BAGIAN = [
  ["syahadat", "Syahadat"],
  ["rukun-islam", "Rukun Islam"],
  ["rukun-iman", "Rukun Iman"],
  ["ihsan", "Ihsan"],
] as const;

function DalilLink({ pokok }: { pokok: Pokok }) {
  const { surah, ayat, nama } = pokok.dalil;
  return (
    <Link
      href={`/quran/${surah}#ayat-${ayat}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <BookOpen className="size-3.5" aria-hidden="true" />
      QS. {nama} {surah}:{ayat}
    </Link>
  );
}

function PokokCard({ item, nomor }: { item: Pokok; nomor: number }) {
  return (
    <li className="flex flex-col rounded-3xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <NomorBadge n={nomor} className="size-12 text-base" />
      <h3 className="mt-4 text-lg font-bold">{item.judul}</h3>
      <p className="mt-2 flex-1 leading-7 text-muted-foreground">
        {item.penjelasan}
      </p>
      <div className="mt-4">
        <DalilLink pokok={item} />
      </div>
    </li>
  );
}

export default function PengenalanPage() {
  return (
    <div className="space-y-14 sm:space-y-20">
      <PageHeader
        icon={Info}
        eyebrow="Dasar-dasar"
        title="Pengenalan Islam"
        description="Islam adalah agama tauhid yang diajarkan Nabi Muhammad ﷺ. Kenali pokok-pokok ajarannya, lengkap dengan dalil dari Al-Qur'an."
      >
        <nav aria-label="Bagian halaman" className="mt-8 flex flex-wrap gap-2">
          {BAGIAN.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              {label}
            </a>
          ))}
        </nav>
      </PageHeader>

      <section aria-labelledby="syahadat" className="scroll-mt-20">
        <SectionHeading id="syahadat" eyebrow="Pintu masuk Islam" title="Syahadat" />
        <div className="relative overflow-hidden rounded-[2rem] border bg-card p-6 text-center shadow-sm sm:p-12">
          <div aria-hidden="true" className="bg-pattern absolute inset-0" />
          <div className="relative">
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-3xl leading-[2] text-primary sm:text-5xl"
            >
              {syahadat.arab}
            </p>
            <p className="mx-auto mt-6 max-w-2xl italic text-gold">
              {syahadat.latin}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-lg leading-8">
              {syahadat.arti}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="rukun-islam" className="scroll-mt-20">
        <SectionHeading id="rukun-islam" eyebrow="Amalan" title="Rukun Islam" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rukunIslam.map((item, index) => (
            <PokokCard key={item.judul} item={item} nomor={index + 1} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="rukun-iman" className="scroll-mt-20">
        <SectionHeading id="rukun-iman" eyebrow="Keyakinan" title="Rukun Iman" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rukunIman.map((item, index) => (
            <PokokCard key={item.judul} item={item} nomor={index + 1} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="ihsan" className="scroll-mt-20">
        <SectionHeading id="ihsan" eyebrow="Puncak kebaikan" title="Ihsan" />
        <blockquote className="surface-hero relative isolate overflow-hidden rounded-[2rem] p-8 text-white sm:p-12">
          <div aria-hidden="true" className="bg-pattern-light absolute inset-0 -z-10" />
          <Quote className="size-10 text-gold-soft" aria-hidden="true" />
          <p className="mt-4 max-w-3xl text-lg leading-8 text-pretty sm:text-xl sm:leading-9">
            {ihsan.penjelasan}
          </p>
        </blockquote>
      </section>
    </div>
  );
}
