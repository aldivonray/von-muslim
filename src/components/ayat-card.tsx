import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Ayat } from "@/lib/content-api";
import { cn } from "@/lib/utils";

// Presentational only: the caller passes verses already fetched from the API.
export function AyatCard({
  id,
  surahNama,
  surah,
  ayat,
  judul,
  className,
}: {
  id?: string;
  surahNama: string;
  surah: number;
  ayat: Ayat[];
  judul?: string;
  className?: string;
}) {
  const dari = ayat[0]?.nomorAyat;
  const sampai = ayat.at(-1)?.nomorAyat;
  const rentang = dari === sampai ? `${dari}` : `${dari}–${sampai}`;
  return (
    <article
      id={id}
      className={cn(
        "relative scroll-mt-20 overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-10",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="bg-pattern absolute inset-x-0 top-0 h-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative">
        {judul && (
          <h2 className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft/50 px-3 py-1 text-xs font-semibold text-gold">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {judul}
          </h2>
        )}
        {ayat.map((a) => (
          <div key={a.nomorAyat} className="mt-6">
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-right text-3xl leading-[2.3] sm:text-4xl"
            >
              {a.teksArab}
            </p>
            <p className="mt-4 text-sm leading-6 italic text-primary/80">
              {a.teksLatin}
            </p>
            <p className="mt-3 border-l-2 border-gold/60 pl-4 text-base leading-7 text-pretty">
              {a.teksIndonesia}
            </p>
          </div>
        ))}
        <Link
          href={`/quran/${surah}#ayat-${dari}`}
          className="group mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          QS. {surahNama} {surah}:{rentang}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
